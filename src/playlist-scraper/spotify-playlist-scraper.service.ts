import { PlaylistInfo, PlaylistInfoFirstPage } from '@/playlist/types/types.js';
import { SpotifyTrackScraper } from '@/track-scraper/spotify-track-scraper.service.js';
import { VendorTrackRepository } from '@/track/vendor-track.repository.js';
import { TrackInfo } from '@/types/types.js';
import { SavePlaylistRequestDto } from '@/user/dto/save-playlist-request.dto.js';
import { ImagePickerUtilService } from '@/utils/image-picker-util/image-picker-util.service.js';
import { Authdata } from '@/vendor-account/dto/decrypted-vendor-account.dto.js';
import { Injectable } from '@nestjs/common';
import { Track } from '@prisma/client';
import axios from 'axios';
import { playlistUrlsByVendor } from './constants.js';
import { PlaylistScraper } from './playlist-scraper.js';

@Injectable()
export class SpotifyPlaylistScraper implements PlaylistScraper {
    constructor(
        private readonly spotifyTrackScraper: SpotifyTrackScraper,
        private readonly vendorTrackRepository: VendorTrackRepository,
    ) {}

    private readonly userUrl: 'https://api.spotify.com/v1/me';
    private readonly playlistUrls = playlistUrlsByVendor['spotify'];
    private readonly pageLimit = 50;
    private readonly playlistCoverSize = 640;
    private readonly albumCoverSize = 300;

    public async savePlaylist(request: SavePlaylistRequestDto, tracks: Track[], authdata: Authdata) {
        const userData: any = await axios.get(this.userUrl, {
            headers: {
                Authorization: authdata.accessToken,
                'Content-Type': 'application/json',
            },
        });
        const createResponse = await axios.post(
            this.playlistUrls.createPlaylist.replace('{userId}', userData.id),
            { name: request.title, description: request.description },
            { headers: { Authorization: authdata.accessToken, 'Content-Type': 'application/json' } },
        );

        const playlistId = createResponse.data?.id;

        const vendorTracks = await this.vendorTrackRepository.findAllWithTrackByIdAndVendor(
            'spotify',
            tracks.map(({ id }) => id),
        );

        const trackIds = tracks.map(({ id }) => vendorTracks[id]?.vendorId).filter((id) => !!id);
        await axios.post(this.playlistUrls.addTracksToPlaylist.replace('{playlistId}', playlistId), null, {
            params: { uris: '' + trackIds.map((id) => 'spotify:track:' + id) },
            headers: { Authorization: authdata.accessToken, 'Content-Type': 'application/json' },
        });
    }

    async getPlaylist(playlistId: string, authdata: Authdata): Promise<PlaylistInfo> {
        const { playlistInfo, offsets } = await this.getFirstPlaylistPage(playlistId, authdata);
        const trackPromiseList = offsets.map((offset) => this.getPlaylistPage(playlistId, offset, authdata));
        const tracks = await Promise.all(trackPromiseList);

        playlistInfo.tracks = playlistInfo.tracks.concat(tracks.flatMap((track) => track));
        return playlistInfo;
    }

    private async getPlaylistPage(playlistId: string, offset: number, authdata: Authdata): Promise<TrackInfo[]> {
        const response = await axios.get(this.playlistUrls.getPlaylistPaged['user'].replace('{playlistId}', playlistId), {
            params: {
                fields: 'items(track(id,name,album(id,name,images),artists(id,name)))',
                offset: offset,
                limit: this.pageLimit,
            },
            headers: { Authorization: authdata.accessToken, 'Content-Type': 'application/json' },
        });
        const data = response.data;
        return data.tracks.items.map(({ track }) => this.spotifyTrackScraper.covertToTrackInfo(track, this.albumCoverSize));
    }

    private async getFirstPlaylistPage(playlistId: string, authdata: Authdata): Promise<PlaylistInfoFirstPage> {
        const response = await axios.get(this.playlistUrls.getPlaylist['user'].replace('{playlistId}', playlistId), {
            params: {
                fields: 'id,name,images,tracks(items(track(id,name,album(id,name,images),artists(id,name))),total,limit)',
            },
            headers: { Authorization: authdata.accessToken, 'Content-Type': 'application/json' },
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
}
