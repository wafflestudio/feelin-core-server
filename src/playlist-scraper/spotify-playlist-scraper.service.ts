import { PlaylistInfo, PlaylistInfoFirstPage } from '@/playlist/types/types.js';
import { SpotifyTrackScraper } from '@/track-scraper/spotify-track-scraper.service.js';
import { TrackInfo } from '@/types/types.js';
import { SpotifyUserScraper } from '@/user-scraper/spotify-user-scraper.service.js';
import { SavePlaylistRequestDto } from '@/user/dto/save-playlist-request.dto.js';
import { ImagePickerUtilService } from '@/utils/image-picker-util/image-picker-util.service.js';
import { Authdata } from '@/vendor-account/dto/decrypted-vendor-account.dto.js';
import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { VendorTrack } from '@prisma/client';
import axios from 'axios';
import { chunk } from 'lodash-es';
import { playlistUrlsByVendor } from './constants.js';
import { PlaylistScraper } from './playlist-scraper.js';

@Injectable()
export class SpotifyPlaylistScraper implements PlaylistScraper {
    constructor(
        private readonly spotifyUserScraper: SpotifyUserScraper,
        private readonly spotifyTrackScraper: SpotifyTrackScraper,
    ) {}

    private readonly playlistUrls = playlistUrlsByVendor['spotify'];
    private readonly pageLimit = 50;
    private readonly savePageLimit = 100;
    private readonly playlistCoverSize = 640;
    private readonly albumCoverSize = 300;

    public async savePlaylist(request: SavePlaylistRequestDto, tracks: VendorTrack[], authdata: Authdata): Promise<string> {
        const userId = await this.spotifyUserScraper.getUserId(authdata.accessToken);
        const createResponse = await axios.post(
            this.playlistUrls.createPlaylist.replace('{userId}', userId),
            { name: request.title, description: request.description },
            { headers: { Authorization: `Bearer ${authdata.accessToken}`, 'Content-Type': 'application/json' } },
        );
        const playlistId = createResponse.data.id;

        const trackIds = tracks.map(({ vendorId }) => vendorId);
        const trackIdsToRequest = chunk(trackIds, this.savePageLimit);
        const promiseList = trackIdsToRequest.map((trackIds) =>
            axios.post(this.playlistUrls.addTracksToPlaylist.replace('{playlistId}', playlistId), null, {
                params: { uris: trackIds.map((id) => `spotify:track:${id}`).join(',') },
                headers: { Authorization: `Bearer ${authdata.accessToken}`, 'Content-Type': 'application/json' },
            }),
        );
        await Promise.all(promiseList);

        return createResponse.data.external_urls.spotify;
    }

    async getPlaylist(playlistId: string, adminToken: string, authdata: Authdata): Promise<PlaylistInfo> {
        const isPrivate = await this.isPlaylistPrivate(playlistId, adminToken, authdata);
        const accessToken = isPrivate ? authdata.accessToken : adminToken;
        if (!accessToken) {
            throw new UnauthorizedException('not authorized to get playlist info');
        }

        const { playlistInfo, offsets } = await this.getFirstPlaylistPage(playlistId, accessToken);
        const trackPromiseList = offsets.map((offset) => this.getPlaylistPage(playlistId, offset, accessToken));
        const tracks = await Promise.all(trackPromiseList);

        playlistInfo.tracks = playlistInfo.tracks.concat(tracks.flatMap((track) => track));
        return playlistInfo;
    }

    async isPlaylistPrivate(playlistId: string, adminToken: string, authdata: Authdata): Promise<boolean> {
        try {
            await axios.get(this.playlistUrls.getPlaylist['user'].replace('{playlistId}', playlistId), {
                headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
            });
            return false;
        } catch (error) {
            if (error?.response?.status !== 404) {
                throw new InternalServerErrorException('failed to get playlist info');
            }
        }
        if (!authdata) {
            throw new UnauthorizedException('not authorized to get playlist info');
        }

        try {
            await axios.get(this.playlistUrls.getPlaylist['user'].replace('{playlistId}', playlistId), {
                headers: { Authorization: `Bearer ${authdata.accessToken}`, 'Content-Type': 'application/json' },
            });
            return true;
        } catch (error) {
            if (error?.response?.status === 404) {
                throw new NotFoundException('playlist does not exist');
            }
            throw new InternalServerErrorException('failed to get playlist info');
        }
    }

    private async getFirstPlaylistPage(playlistId: string, accessToken: string): Promise<PlaylistInfoFirstPage> {
        const response = await axios.get(this.playlistUrls.getPlaylist['user'].replace('{playlistId}', playlistId), {
            params: {
                fields: 'id,name,images,tracks(items(track(id,name,album(id,name,images),artists(id,name))),total,limit)',
            },
            headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        });
        const data = response.data;
        const tracks = data.tracks.items.map(({ track }) =>
            this.spotifyTrackScraper.covertToTrackInfo(track, this.albumCoverSize),
        );

        const offsets = [];
        for (let i = 0; i < Math.ceil((data.tracks.total - data.tracks.limit) / this.pageLimit) - 1; i++) {
            offsets.push(i * this.pageLimit + data.tracks.limit);
        }

        return {
            playlistInfo: {
                id: playlistId,
                title: data.name,
                coverUrl: ImagePickerUtilService.pickImageOfSize(data.images, this.playlistCoverSize),
                tracks,
            },
            offsets,
        };
    }

    private async getPlaylistPage(playlistId: string, offset: number, accessToken: string): Promise<TrackInfo[]> {
        const response = await axios.get(this.playlistUrls.getPlaylistPaged['user'].replace('{playlistId}', playlistId), {
            params: {
                fields: 'items(track(id,name,album(id,name,images),artists(id,name)))',
                offset: offset,
                limit: this.pageLimit,
            },
            headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        });
        const data = response.data;
        return data.tracks.items.map(({ track }) => this.spotifyTrackScraper.covertToTrackInfo(track, this.albumCoverSize));
    }
}
