import { AlbumRepository } from '@/album/album-repository.js';
import { AlbumDto } from '@/album/dto/album.dto.js';
import { VendorAlbumRepository } from '@/album/vendor-album.repository.js';
import { ArtistRepository } from '@/artist/artist.repository.js';
import { ArtistDto } from '@/artist/dto/artist.dto.js';
import { VendorArtistRepository } from '@/artist/vendor-artist.repository.js';
import { PlaylistScraperService } from '@/playlist-scraper/playlist-scraper.service.js';
import { PrismaService } from '@/prisma.service.js';
import { TrackScraperService } from '@/track-scraper/track-scraper.service.js';
import { TrackDto } from '@/track/dto/track.dto.js';
import { TrackRepository } from '@/track/track.repository.js';
import { TrackService } from '@/track/track.service.js';
import { VendorTrackRepository } from '@/track/vendor-track.repository.js';
import { Vendors } from '@/types/types.js';
import { UserScraperService } from '@/user-scraper/user-scraper.service.js';
import { SavePlaylistRequestDto } from '@/user/dto/save-playlist-request.dto.js';
import { PromiseUtil } from '@/utils/promise-util/promise-util.service.js';
import { SlackUtilService } from '@/utils/slack-util/slack-util.service.js';
import { DecryptedVendorAccountDto } from '@/vendor-account/dto/decrypted-vendor-account.dto.js';
import { VendorAccountRepository } from '@/vendor-account/vendor-account.repository.js';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Album, Artist, Playlist, Prisma, Track, User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { TrackMatcherService } from './../track-matcher/track-matcher.service.js';
import { CreatePlaylistRequestDto } from './dto/create-playlist-request.dto.js';
import { PlaylistPreviewDto } from './dto/playlist-preview.dto.js';
import { PlaylistDto } from './dto/playlist.dto.js';
import { PlaylistRepository } from './playlist.repository.js';
import { PlaylistInfo } from './types/types.js';
import { VendorPlaylistRepository } from './vendor-playlist.repository.js';

@Injectable()
export class PlaylistService {
    constructor(
        private readonly configService: ConfigService,
        private readonly playlistScraperService: PlaylistScraperService,
        private readonly userScraperService: UserScraperService,
        private readonly trackService: TrackService,
        private readonly trackScraperService: TrackScraperService,
        private readonly trackMatcherService: TrackMatcherService,
        private readonly slackUtilService: SlackUtilService,
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
    ) {
        this.trackSearchBatchSize = this.configService.get<number>('TRACK_SEARCH_BATCH_SIZE');
    }

    private readonly trackSearchBatchSize: number;

    async getPlaylist(playlistId: string): Promise<PlaylistDto> {
        const playlist = await this.playlistRepository.findWithOriginalVendorPlaylistById(playlistId);
        if (!playlist) {
            throw new NotFoundException('not found', `playlist with id ${playlistId} not found`);
        }

        const tracks = await this.trackRepository.findAllWithArtistAndAlbumByPlaylistId(playlistId);
        const originalVendorPlaylist =
            playlist.vendorPlaylist.length > 0
                ? this.playlistScraperService
                      .get(playlist.vendorPlaylist[0].vendor as Vendors)
                      .getVendorPlaylistDto(playlist.vendorPlaylist[0])
                : null;
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
            originalVendorPlaylist,
            new PlaylistPreviewDto(playlistId, playlist.coverUrl),
        );
    }

    async createPlaylist(createPlaylistDto: CreatePlaylistRequestDto, user: User): Promise<PlaylistDto> {
        const { playlistUrl } = createPlaylistDto;
        const { vendor, playlistId } = await this.playlistScraperService.getStreamAndId(playlistUrl);

        const vendorPlaylist = await this.vendorPlaylistRepository.findWithPlaylistById(playlistId, vendor);

        if (vendorPlaylist) {
            return this.getPlaylist(vendorPlaylist.playlist.id);
        }

        const vendorAccount = await this.vendorAccountRepository.findLinkedByUserIdAndVendor(user.id, vendor);
        const adminToken = await this.userScraperService.get(vendor).getAdminToken();
        const authdata =
            vendorAccount === null ? null : await this.userScraperService.get(vendor).decryptAndRefreshToken(vendorAccount);
        const playlistData = await this.playlistScraperService.get(vendor).getPlaylist(playlistId, adminToken, authdata);
        const playlist = await this.saveAndGetPlaylistDto(playlistData, vendor);
        return this.getPlaylist(playlist.id);
    }

    async savePlaylistToAccount(
        user: User,
        vendorAccount: DecryptedVendorAccountDto,
        playlistId: string,
        request: SavePlaylistRequestDto,
    ): Promise<string> {
        const playlist = await this.playlistRepository.findById(playlistId);
        if (!playlist) {
            throw new NotFoundException('not found', `playlist with id ${playlistId} not found`);
        }
        const { vendor, authdata } = vendorAccount;
        await this.convertPlaylist(playlistId, vendor);

        const tracks = await this.trackRepository.findAllWithArtistAndAlbumAndVendorTrackByPlaylistId(playlistId, vendor);
        const vendorTracks = tracks.map((track) => track.vendorTracks?.[0]).filter((track) => track);
        const playlistUrl = await this.playlistScraperService.get(vendor).savePlaylist(request, vendorTracks, authdata);
        this.slackUtilService
            .sendSlackMessage(
                `
            :musical_note: 새로운 플레이리스트 생성 :musical_note: 
            > 유저 아이디: ${user.id}
            > 플레이리스트 제목: ${playlist.title}
            > 플레이리스트 링크: ${playlistUrl}
        `,
            )
            .catch((e) => {});
        return playlistUrl;
    }

    async convertPlaylist(playlistId: string, vendor: Vendors): Promise<void> {
        const tracks = await this.trackRepository.findAllWithArtistAndAlbumAndVendorTrackByPlaylistId(playlistId, vendor);
        const adminToken = await this.userScraperService.get(vendor).getAdminToken();
        const searchList = tracks.filter((track) => track.vendorTracks.length === 0);
        const searchResults = await PromiseUtil.promiseAllBatched(
            searchList,
            async (track) => {
                const searchResult = await this.trackScraperService
                    .get(vendor)
                    .searchTrack(this.trackService.toTrackInfo(track), adminToken);
                return { track, searchResult };
            },
            this.trackSearchBatchSize,
        ).catch((e) => {
            throw new InternalServerErrorException('failed to convert playlist', e.message);
        });
        const matchResults = searchResults
            .map(({ track, searchResult }) => {
                const matchedVendorTrack = this.trackMatcherService.getMatchedVendorTrack(
                    searchResult,
                    this.trackService.toTrackInfo(track),
                );
                return { track, matchedVendorTrack };
            })
            .filter(({ matchedVendorTrack }) => matchedVendorTrack);
        // TODO: get detailed track info if artist and album need to be merged
        /* 
        if (!searchResults[0].searchResult.isDetailed) {
            const detailedTrackInfo = await this.trackScraperService.get(vendor).getTracksByIds(
                matchResults.map(({ matchedVendorTrack }) => matchedVendorTrack.id),
                'authToken',
            );
            const detailedTrackById = new Map(detailedTrackInfo.map((track) => [track.id, track]));
            matchResults = matchResults.map(({ track, matchedVendorTrack }) => {
                const detailedTrack = detailedTrackById.get(matchedVendorTrack.id);
                if (detailedTrack) {
                    return { track, matchedVendorTrack: detailedTrack };
                }
                return { track, matchedVendorTrack };
            });
        }
        */
        const existingVendorTracks = await this.vendorTrackRepository.findAllWithTrackByIdAndVendor(
            vendor,
            matchResults.map(({ matchedVendorTrack }) => matchedVendorTrack.id),
        );
        const existingVendorTracksById = new Map(existingVendorTracks.map((vendorTrack) => [vendorTrack.vendorId, vendorTrack]));
        const vendorTrackPromiseList = matchResults.flatMap(({ track, matchedVendorTrack }) =>
            this.trackService.mergeOrCreateTrack(
                track,
                existingVendorTracksById.get(matchedVendorTrack.id),
                matchedVendorTrack,
                vendor,
            ),
        );
        await this.prismaService.$transaction(vendorTrackPromiseList);
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
            { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted, timeout: 60000 },
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

        const playlist = await this.playlistRepository.create(
            {
                id: uuidv4(),
                title,
                vendorPlaylist: {
                    connectOrCreate: {
                        where: { vendorId_vendor: { vendorId: id, vendor } },
                        create: { id: uuidv4(), vendor, vendorId: id },
                    },
                },
                coverUrl: playlistData.coverUrl,
            },
            tx,
        );

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
