import { AlbumDto } from '@/album/dto/album.dto.js';
import { Album } from '@/album/entity/album.entity.js';
import { VendorAlbum } from '@/album/entity/vendorAlbum.entity.js';
import { VendorAlbumRepository } from '@/album/vendorAlbum.repository.js';
import { ArtistDto } from '@/artist/dto/artist.dto.js';
import { Artist } from '@/artist/entity/artist.entity.js';
import { VendorArtist } from '@/artist/entity/vendorArtist.entity.js';
import { VendorArtistRepository } from '@/artist/vendorArtist.repository.js';
import { AuthdataService } from '@/authdata/authdata.service.js';
import { PlaylistScraperService } from '@/playlist-scraper/playlist-scraper.service.js';
import { PlaylistTrack } from '@/playlist/entity/playlist-track.entity.js';
import { TrackDto } from '@/track/dto/track.dto.js';
import { TrackArtist } from '@/track/entity/track-artist.entity.js';
import { Track } from '@/track/entity/track.entity.js';
import { VendorTrack } from '@/track/entity/vendor-track.entity.js';
import { TrackService } from '@/track/track.service.js';
import { VendorTrackRepository } from '@/track/vendor-track.repository.js';
import { ITrack } from '@/types/types.js';
import { SavePlaylistRequestDto } from '@/user/dto/save-playlist-request.dto.js';
import { DecryptedVendorAccountDto } from '@/vendor-account/dto/decrypted-vendor-account.dto.js';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { CreatePlaylistRequestDto } from './dto/create-playlist-request.dto.js';
import { PlaylistPreviewDto } from './dto/playlist-preview.dto.js';
import { PlaylistDto } from './dto/playlist.dto.js';
import { SavePlaylistResponseDto } from './dto/save-playlist-response.dto.js';
import { Playlist } from './entity/playlist.entity.js';
import { VendorPlaylist } from './entity/vendorPlaylist.entity.js';
import { PlaylistRepository } from './playlist.repository.js';
import { PlaylistTrackRepository } from './playlistTrack.repository.js';
import { IPlaylist } from './types/types.js';

@Injectable()
export class PlaylistService {
    constructor(
        private readonly playlistScraperService: PlaylistScraperService,
        private readonly authdataService: AuthdataService,
        private readonly trackService: TrackService,
        @InjectRepository(VendorPlaylist) private readonly vendorPlaylistRepository: Repository<VendorPlaylist>,
        @InjectRepository(TrackArtist) private readonly trackArtistRepository: Repository<TrackArtist>,
        private readonly playlistRepository: PlaylistRepository,
        private readonly playlistTrackRepository: PlaylistTrackRepository,
        private readonly vendorTrackRepository: VendorTrackRepository,
        private readonly vendorArtistRepository: VendorArtistRepository,
        private readonly vendorAlbumRepository: VendorAlbumRepository,
        private readonly dataSource: DataSource,
    ) {}

    async getMatchedTracks(playlist: Playlist) {
        // TODO: Implement me
        return;
    }

    async getPlaylist(playlistId: string): Promise<PlaylistDto> {
        const playlist = await this.playlistRepository.findOneBy({ id: playlistId });
        if (!playlist) {
            throw new NotFoundException('not found', `playlist with id ${playlistId} not found`);
        }

        const playlistTracks = await this.playlistTrackRepository.findAllWithTrackAndAlbumById(playlistId);
        const trackArtistMap: Map<string, Artist[]> = new Map();
        const trackArtists = await this.trackArtistRepository.find({
            where: { track: { id: In(playlistTracks.map(({ track }) => track.id)) } },
            relations: {
                track: true,
                artist: true,
            },
        });
        trackArtists.forEach(({ track, artist }) =>
            trackArtistMap.set(track.id, [...(trackArtistMap.get(track.id) ?? []), artist]),
        );

        return new PlaylistDto(
            playlistId,
            playlist.title,
            playlistTracks.map(
                ({ track }) =>
                    new TrackDto(
                        track.id,
                        track.title,
                        trackArtistMap.get(track.id).map((artist) => new ArtistDto(artist.id, artist.name)),
                        new AlbumDto(track.album.id, track.album.title, track.album.coverUrl),
                    ),
            ),
            new PlaylistPreviewDto(playlistId, playlistTracks[0].track.album.coverUrl),
        );
    }

    async createPlaylist(createPlaylistDto: CreatePlaylistRequestDto): Promise<PlaylistDto> {
        const { playlistUrl } = createPlaylistDto;
        const { vendor, playlistId } = await this.playlistScraperService.getStreamAndId(playlistUrl);

        const vendorPlaylist = await this.vendorPlaylistRepository.findOne({
            where: { vendorId: playlistId, vendor: vendor },
            relations: ['playlist'],
        });

        if (vendorPlaylist) {
            return this.getPlaylist(vendorPlaylist.playlist.id);
        }

        const playlistData = await this.playlistScraperService.get(vendor).getPlaylist(playlistId);
        return this.saveAndGetPlaylistDto(playlistData);
    }

    async savePlaylistToAccount(
        vendorAccount: DecryptedVendorAccountDto,
        playlistId: string,
        request: SavePlaylistRequestDto,
    ): Promise<SavePlaylistResponseDto> {
        const playlist = await this.playlistRepository.findWithTracksById(playlistId).catch(() => {
            throw new NotFoundException('Not Found', 'playlist not found');
        });
        const trackIds = playlist.tracks.map((track) => track.id);
        const vendorTracks = await this.vendorTrackRepository.findAllWithTrackByIdAndVendor(vendorAccount.vendor, trackIds);
        const vendorTrackMapById = new Map(vendorTracks.map((vendorTrack) => [vendorTrack.track.id, vendorTrack]));
        const { vendor, authdata } = vendorAccount;

        if (!!request.searchResults) {
            const tracksToSave = playlist.tracks.filter((track) => !vendorTrackMapById.has(track.id));

            const vendorTracksToSave = tracksToSave
                .map((track) => {
                    const reference: ITrack = {
                        vendor,
                        title: track.title,
                        id: '',
                        artists: track.artists.map(({ name }) => ({ vendor, name, id: '' })),
                        album: { vendor, title: track.album.title, id: '', coverUrl: track.album.coverUrl },
                    };

                    const matchedVendorTrackId = this.trackService.getMatchedVendorTrack(request.searchResults, reference);
                    if (!!matchedVendorTrackId) {
                        return VendorTrack.create({ vendor, vendorId: matchedVendorTrackId, track });
                    }
                    return null;
                })
                .filter((vendorTrack) => !!vendorTrack);

            await this.vendorTrackRepository.save(vendorTracksToSave);
        } else {
            const missingTracks = playlist.tracks.filter((track) => !vendorTrackMapById.get(track.id));
            if (!missingTracks) {
                // FIXME: throw error and return with body
                return new SavePlaylistResponseDto(
                    false,
                    missingTracks.map((track) => this.trackService.toTrackDto(track)),
                );
            }
        }

        const authdataInterface = this.authdataService.fromString(vendor, authdata);
        await this.playlistScraperService.get(vendor).savePlaylist(request, playlist.tracks, authdataInterface);
    }

    private async saveAndGetPlaylistDto(playlistData: IPlaylist): Promise<PlaylistDto> {
        const trackIdMap = new Map<string, Track>();
        const artistIdMap = new Map<string, Artist>();
        const albumIdMap = new Map<string, Album>();

        const vendorTracks = await this.vendorTrackRepository.findAllWithTrackByIdAndVendor(
            playlistData.vendor,
            playlistData.tracks.map(({ id }) => id),
        );
        vendorTracks.forEach((vendorTrack) => trackIdMap.set(vendorTrack.vendorId, vendorTrack.track));

        const vendorArtists = await this.vendorArtistRepository.findAllWithArtistById(
            playlistData.vendor,
            playlistData.tracks.flatMap(({ artists }) => artists.map(({ id }) => id)),
        );
        vendorArtists.forEach((vendorArtist) => artistIdMap.set(vendorArtist.vendorId, vendorArtist.artist));

        const vendorAlbums = await this.vendorAlbumRepository.findAllWithAlbumById(
            playlistData.vendor,
            playlistData.tracks.flatMap(({ album }) => album.id),
        );
        vendorAlbums.forEach((vendorAlbum) => albumIdMap.set(vendorAlbum.vendorId, vendorAlbum.album));

        const playlistId = await this.savePlaylist(playlistData, trackIdMap, artistIdMap, albumIdMap);

        return new PlaylistDto(
            playlistId,
            playlistData.title,
            playlistData.tracks.map(
                ({ id, title, artists, album }) =>
                    new TrackDto(
                        trackIdMap.get(id).id,
                        title,
                        artists.map((artist) => new ArtistDto(artistIdMap.get(artist.id).id, artist.name)),
                        new AlbumDto(albumIdMap.get(album.id).id, album.title, album.coverUrl),
                    ),
            ),
            new PlaylistPreviewDto(playlistId, playlistData.tracks[0].album.coverUrl),
        );
    }

    private async savePlaylist(
        playlistData: IPlaylist,
        trackIdMap: Map<string, Track>,
        artistIdMap: Map<string, Artist>,
        albumIdMap: Map<string, Album>,
    ): Promise<string> {
        const { vendor, id, title, tracks: tracksData } = playlistData;

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const playlist = await queryRunner.manager.save(Playlist.create({ title: title }));
            await queryRunner.manager.upsert(
                VendorPlaylist,
                VendorPlaylist.create({
                    vendor: vendor,
                    vendorId: id,
                    playlist: playlist,
                }),
                ['vendorId', 'vendor'],
            );

            const tracksDataWithAlbum = await Promise.all(
                tracksData.map(async (trackData) => {
                    const { album: albumData } = trackData;
                    if (!!albumIdMap.get(albumData?.id)) {
                        return { albumEntity: albumIdMap.get(albumData?.id), ...trackData };
                    }

                    const album = await queryRunner.manager.save(
                        Album.create({ title: albumData?.title, coverUrl: albumData?.coverUrl }),
                    );
                    await queryRunner.manager.upsert(
                        VendorAlbum,
                        VendorAlbum.create({
                            vendor: vendor,
                            vendorId: albumData?.id,
                            album: album,
                        }),
                        ['vendorId', 'vendor'],
                    );
                    albumIdMap.set(albumData?.id, album);
                    return { albumEntity: album, ...trackData };
                }),
            );

            const artistsDataWithTrack = await Promise.all(
                tracksDataWithAlbum.map(async (trackData) => {
                    const { albumEntity, id, title, artists } = trackData;
                    if (!!trackIdMap.get(id)) {
                        return { trackEntity: trackIdMap.get(id), artists };
                    }

                    const track = await queryRunner.manager.save(Track.create({ title: title, album: albumEntity }));
                    await queryRunner.manager.upsert(
                        VendorTrack,
                        VendorTrack.create({
                            vendor: vendor,
                            vendorId: id,
                            track: track,
                        }),
                        ['vendorId', 'vendor'],
                    );
                    trackIdMap.set(id, track);
                    return { trackEntity: track, artists };
                }),
            );

            await Promise.all(
                artistsDataWithTrack.map(async ({ trackEntity, artists }) => {
                    artists.forEach(async (artistData) => {
                        if (!!artistIdMap.get(artistData?.id)) {
                            return;
                        }

                        const artist = await queryRunner.manager.save(Artist.create({ name: artistData?.name }));
                        await queryRunner.manager.upsert(
                            VendorArtist,
                            VendorArtist.create({
                                vendor: vendor,
                                vendorId: artistData?.id,
                                artist: artist,
                            }),
                            ['vendorId', 'vendor'],
                        );
                        await queryRunner.manager.save(TrackArtist.create({ track: trackEntity, artist: artist }));
                        artistIdMap.set(artistData?.id, artist);
                    });
                }),
            );

            await queryRunner.manager.save(
                artistsDataWithTrack.map(({ trackEntity }) =>
                    PlaylistTrack.create({
                        playlist: playlist,
                        track: trackEntity,
                    }),
                ),
            );

            await queryRunner.commitTransaction();

            return playlist.id;
        } catch (error) {
            console.error(error);
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException('DB error', 'failed to save playlist');
        } finally {
            await queryRunner.release();
        }
    }
}
