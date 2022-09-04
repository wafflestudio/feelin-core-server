import { Album } from '@/album/entity/album.entity.js';
import { VendorAlbum } from '@/album/entity/vendorAlbum.entity.js';
import { Artist } from '@/artist/entity/artist.entity.js';
import { VendorArtist } from '@/artist/entity/vendorArtist.entity.js';
import { AuthdataService } from '@/authdata/authdata.service.js';
import { PlaylistScraperService } from '@/playlist-scraper/playlist-scraper.service.js';
import { PlaylistTrack } from '@/playlist/entity/playlist-track.entity.js';
import { TrackArtist } from '@/track/entity/track-artist.entity.js';
import { Track } from '@/track/entity/track.entity.js';
import { VendorTrack } from '@/track/entity/vendorTrack.entity.js';
import { VendorTrackRepository } from '@/track/vendorTrack.repository.js';
import { TrackService } from '@/track/track.service.js';
import { SavePlaylistDto } from '@/user/dto/save-playlist.dto.js';
import { User } from '@/user/entity/user.entity.js';
import { VendorUser } from '@/user/entity/vendorUser.entity.js';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { asymmDecrypt, symmDecrypt } from '@utils/cipher.js';
import { DataSource, In, Repository } from 'typeorm';
import { CreatePlaylistRequestDto } from './dto/create-playlist-request.dto.js';
import { PlaylistDto } from './dto/playlist.dto.js';
import { Playlist } from './entity/playlist.entity.js';
import { VendorPlaylist } from './entity/vendorPlaylist.entity.js';
import { IPlaylist } from './types/types.js';
import { VendorArtistRepository } from '@/artist/vendorArtist.repository.js';
import { VendorAlbumRepository } from '@/album/vendorAlbum.repository.js';
import { PlaylistPreviewDto } from './dto/playlist-preview.dto.js';
import { TrackDto } from '@/track/dto/track.dto.js';
import { ArtistDto } from '@/artist/dto/artist.dto.js';
import { AlbumDto } from '@/album/dto/album.dto.js';
import { PlaylistTrackRepository } from './playlistTrack.repository.js';

@Injectable()
export class PlaylistService {
    constructor(
        @InjectRepository(Playlist)
        private readonly playlistRepository: Repository<Playlist>,
        @InjectRepository(VendorPlaylist)
        private readonly vendorPlaylistRepository: Repository<VendorPlaylist>,
        @InjectRepository(TrackArtist)
        private readonly trackArtistRepository: Repository<TrackArtist>,
        private readonly playlistTrackRepository: PlaylistTrackRepository,
        private readonly vendorTrackRepository: VendorTrackRepository,
        private readonly vendorArtistRepository: VendorArtistRepository,
        private readonly vendorAlbumRepository: VendorAlbumRepository,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(VendorUser)
        private readonly streamAccountRepository: Repository<VendorUser>,
        private readonly dataSource: DataSource,
        private readonly trackService: TrackService,
        private readonly playlistScraperService: PlaylistScraperService,
        private readonly authdataService: AuthdataService,
    ) {}

    async getMatchedTracks(playlist: Playlist) {
        // TODO: Implement me
        return;
    }

    async getPlaylist(playlistId: string): Promise<PlaylistDto> {
        const playlist = await this.playlistRepository.findOne({ where: { id: playlistId } });
        if (!playlist) {
            throw new Error(`playlist with id ${playlistId} not found`);
        }

        const playlistTracks = await this.playlistTrackRepository.findAllWithTrackWithAlbumById(playlistId);
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

        let playlistData = await this.playlistScraperService.get(vendor).getPlaylist(playlistId);
        return this.saveAndGetPlaylistDto(playlistData);
    }

    protected async saveAndGetPlaylistDto(playlistData: IPlaylist): Promise<PlaylistDto> {
        const trackIdMap = new Map<string, Track>();
        const artistIdMap = new Map<string, Artist>();
        const albumIdMap = new Map<string, Album>();

        const vendorTracks = await this.vendorTrackRepository.findAllWithTrackById(
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

    protected async savePlaylist(
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
            throw new Error('failed to save playlist');
        } finally {
            await queryRunner.release();
        }
    }

    async savePlaylistToAccount(userId: string, playlistId: string, savePlaylistDto: SavePlaylistDto) {
        const user = await this.userRepository.findOne({
            where: {
                id: userId,
            },
        });
        if (user === undefined) {
            throw new NotFoundException('Not Found', 'user not found');
        }

        const playlist = await this.playlistRepository.findOne({
            where: {
                id: playlistId,
            },
        });
        if (playlist === undefined) {
            throw new NotFoundException('Not Found', 'playlist not found');
        }

        const playlistTrack = await this.playlistTrackRepository.find({
            where: {
                playlist: {
                    id: playlistId,
                },
            },
            relations: ['track', 'playlist'],
        });

        const { symmKey, publicKey } = savePlaylistDto;
        const account = await this.streamAccountRepository.findOne({
            where: {
                user: {
                    id: userId,
                },
                publicKey: publicKey,
            },
        });

        if (account === undefined) {
            throw new NotFoundException('Not Found', 'available streaming service account not found');
        }

        const key = await asymmDecrypt(symmKey, account.privateKey);
        const cookie = await symmDecrypt(account.cookie, key);

        const response = await this.playlistScraperService.get(account.vendor).savePlaylist(
            playlist,
            playlistTrack.map(({ track }) => track),
            this.authdataService.fromString(account.vendor, cookie),
        );
        return response;
    }
}
