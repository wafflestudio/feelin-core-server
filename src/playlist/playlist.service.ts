import { AlbumRepository } from '@/album/album-repository.js';
import { AlbumDto } from '@/album/dto/album.dto.js';
import { VendorAlbumRepository } from '@/album/vendor-album.repository.js';
import { ArtistRepository } from '@/artist/artist.repository.js';
import { ArtistDto } from '@/artist/dto/artist.dto.js';
import { VendorArtistRepository } from '@/artist/vendor-artist.repository.js';
import { AuthService } from '@/auth/auth.service.js';
import { PlaylistScraperService } from '@/playlist-scraper/playlist-scraper.service.js';
import { PrismaService } from '@/prisma.service.js';
import { TrackDto } from '@/track/dto/track.dto.js';
import { TrackRepository } from '@/track/track.repository.js';
import { TrackService } from '@/track/track.service.js';
import { VendorTrackRepository } from '@/track/vendor-track.repository.js';
import { Vendors } from '@/types/types.js';
import { SavePlaylistRequestDto } from '@/user/dto/save-playlist-request.dto.js';
import { DecryptedVendorAccountDto } from '@/vendor-account/dto/decrypted-vendor-account.dto.js';
import { VendorAccountRepository } from '@/vendor-account/vendor-account.repository.js';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Album, Artist, Playlist, Prisma, Track, User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { TrackMatcherService } from './../track-matcher/track-matcher.service.js';
import { CreatePlaylistRequestDto } from './dto/create-playlist-request.dto.js';
import { PlaylistPreviewDto } from './dto/playlist-preview.dto.js';
import { PlaylistDto } from './dto/playlist.dto.js';
import { SavePlaylistResponseDto } from './dto/save-playlist-response.dto.js';
import { PlaylistRepository } from './playlist.repository.js';
import { PlaylistInfo } from './types/types.js';
import { VendorPlaylistRepository } from './vendor-playlist.repository.js';

@Injectable()
export class PlaylistService {
    constructor(
        private readonly authService: AuthService,
        private readonly playlistScraperService: PlaylistScraperService,
        private readonly trackService: TrackService,
        private readonly trackMatcherService: TrackMatcherService,
        private readonly prismaService: PrismaService,
        private readonly playlistRepository: PlaylistRepository,
        private readonly trackRepository: TrackRepository,
        private readonly artistRepository: ArtistRepository,
        private readonly albumRepository: AlbumRepository,
        private readonly vendorAccountRepository: VendorAccountRepository,
        private readonly vendorPlaylistRepository: VendorPlaylistRepository,
        private readonly vendorTrackRepository: VendorTrackRepository,
        private readonly vendorArtistRepository: VendorArtistRepository,
        private readonly vendorAlbumRepository: VendorAlbumRepository,
    ) {}

    async getPlaylist(playlistId: string): Promise<PlaylistDto> {
        const playlist = await this.playlistRepository.findById(playlistId);
        if (!playlist) {
            throw new NotFoundException('not found', `playlist with id ${playlistId} not found`);
        }

        const tracks = await this.trackRepository.findAllWithArtistAndAlbumByPlaylistId(playlistId);
        return new PlaylistDto(
            playlistId,
            playlist.title,
            tracks.map(
                (track) =>
                    new TrackDto(
                        track.id,
                        track.title,
                        track.artists.map(({ artist }) => new ArtistDto(artist.id, artist.name)),
                        new AlbumDto(track.album.id, track.album.title, track.album.coverUrl),
                    ),
            ),
            new PlaylistPreviewDto(playlistId, tracks[0].album.coverUrl),
        );
    }

    async createPlaylist(createPlaylistDto: CreatePlaylistRequestDto, user: User): Promise<PlaylistDto> {
        const { playlistUrl } = createPlaylistDto;
        const { vendor, playlistId } = await this.playlistScraperService.getStreamAndId(playlistUrl);

        const vendorPlaylist = await this.vendorPlaylistRepository.findWithPlaylistById(playlistId, vendor);

        if (vendorPlaylist) {
            return this.getPlaylist(vendorPlaylist.playlist.id);
        }

        const vendorAccount = await this.vendorAccountRepository.findByUserIdAndVendor(user.id, vendor);
        const decryptedVendorAccount = this.authService.decryptVendorAccount(vendorAccount);
        const playlistData = await this.playlistScraperService
            .get(vendor)
            .getPlaylist(playlistId, decryptedVendorAccount?.authdata);
        const playlist = await this.saveAndGetPlaylistDto(playlistData, vendor);
        return this.getPlaylist(playlist.id);
    }

    async savePlaylistToAccount(
        vendorAccount: DecryptedVendorAccountDto,
        playlistId: string,
        request: SavePlaylistRequestDto,
    ): Promise<SavePlaylistResponseDto> {
        const playlist = this.playlistRepository.findById(playlistId);
        if (!playlist) {
            throw new NotFoundException('not found', `playlist with id ${playlistId} not found`);
        }
        const tracks = await this.trackRepository.findAllWithArtistAndAlbumByPlaylistId(playlistId);
        const trackIds = tracks.map((track) => track.id);
        const vendorTracks = await this.vendorTrackRepository.findAllWithTrackByIdAndVendor(vendorAccount.vendor, trackIds);
        const vendorTrackMapById = new Map(vendorTracks.map((vendorTrack) => [vendorTrack.track.id, vendorTrack]));
        const { vendor, authdata } = vendorAccount;

        if (!!request.searchResults) {
            const tracksToSave = tracks.filter((track) => !vendorTrackMapById.has(track.id));

            const vendorTracksToSave = tracksToSave
                .map((track) => {
                    const reference = this.trackService.toTrackInfo(track);
                    const matchedVendorTrack = this.trackMatcherService.getMatchedVendorTrack(request.searchResults, reference);
                    if (!!matchedVendorTrack) {
                        return this.vendorTrackRepository.create({
                            id: uuidv4(),
                            vendor,
                            vendorId: matchedVendorTrack.id,
                            track: { connect: { id: track.id } },
                        });
                    }
                    return null;
                })
                .filter((vendorTrack) => !!vendorTrack);

            await this.prismaService.$transaction(vendorTracksToSave);
        } else {
            const missingTracks = tracks.filter((track) => !vendorTrackMapById.get(track.id));
            if (!missingTracks) {
                // FIXME: throw error and return with body
                return new SavePlaylistResponseDto(
                    false,
                    missingTracks.map((track) => this.trackService.toTrackDto(track)),
                );
            }
        }

        await this.playlistScraperService.get(vendor).savePlaylist(request, tracks, authdata);
    }

    private async saveAndGetPlaylistDto(playlistData: PlaylistInfo, vendor: Vendors): Promise<Playlist> {
        const vendorTracks = await this.vendorTrackRepository.findAllWithTrackByIdAndVendor(
            vendor,
            playlistData.tracks.map(({ id }) => id),
        );
        const trackByVendorId = new Map(vendorTracks.map((vendorTrack) => [vendorTrack.vendorId, vendorTrack.track]));

        const vendorArtists = await this.vendorArtistRepository.findAllWithArtistById(
            vendor,
            playlistData.tracks.flatMap(({ artists }) => artists.map(({ id }) => id)),
        );
        const artistByVendorId = new Map(vendorArtists.map((vendorArtist) => [vendorArtist.vendorId, vendorArtist.artist]));

        const vendorAlbums = await this.vendorAlbumRepository.findAllWithAlbumById(
            vendor,
            playlistData.tracks.map(({ album }) => album.id),
        );
        const albumByVendorId = new Map(vendorAlbums.map((vendorAlbum) => [vendorAlbum.vendorId, vendorAlbum.album]));

        return await this.prismaService.$transaction(
            async (tx) => this.savePlaylist(tx, playlistData, vendor, trackByVendorId, artistByVendorId, albumByVendorId),
            { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted },
        );
    }

    private async savePlaylist(
        tx: Prisma.TransactionClient,
        playlistData: PlaylistInfo,
        vendor: Vendors,
        trackByVendorId: Map<string, Track>,
        artistByVendorId: Map<string, Artist>,
        albumByVendorId: Map<string, Album>,
    ): Promise<Playlist> {
        const { id, title, tracks: tracksData } = playlistData;

        const playlist = await this.playlistRepository.createWithVendorPlaylist({
            data: { id: uuidv4(), title },
            vendorPlaylist: { vendor, id },
            tx,
        });

        const createTracksAndArtistsAndAlbums = tracksData.map(async (trackData, idx) => {
            const { title, id, album: albumData, artists: artistsData } = trackData;
            if (trackByVendorId.has(id)) {
                return this.trackRepository.connectPlaylist({
                    playlistId: playlist.id,
                    trackId: trackByVendorId.get(id).id,
                    trackSequence: idx,
                    tx,
                });
            }

            const album =
                albumByVendorId.get(albumData.id) ??
                (await this.albumRepository.createWithVendorAlbum({
                    data: {
                        id: uuidv4(),
                        title: albumData?.title,
                        coverUrl: albumData?.coverUrl,
                    },
                    vendorAlbum: { vendor, id: albumData.id },
                    tx,
                }));
            albumByVendorId.set(albumData.id, album);

            const createArtists = artistsData.map(async (artistData) => {
                const { name, id } = artistData;
                const artist =
                    artistByVendorId.get(id) ??
                    (await this.artistRepository.createWithVendorArtist({
                        data: { id: uuidv4(), name },
                        vendorArtist: { vendor, id },
                        tx,
                    }));
                artistByVendorId.set(id, artist);

                return artist;
            });
            const artists = await Promise.all(createArtists.filter((x) => !!x));

            const track = await this.trackRepository.createWithArtistAndAlbumAndPlaylistAndVendorTrack({
                data: { id: uuidv4(), title },
                artists: artistsData.map(({ id }, idx) => ({
                    artistId: artistByVendorId.get(id).id,
                    artistSequence: idx,
                })),
                albumId: albumByVendorId.get(albumData.id).id,
                playlistId: playlist.id,
                trackSequence: idx,
                vendorTrack: { vendor, id },
                tx,
            });
            trackByVendorId.set(id, track);

            return { album, artists, track };
        });
        await Promise.all(createTracksAndArtistsAndAlbums.filter((x) => !!x));

        return playlist;
    }
}
