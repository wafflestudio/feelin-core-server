import { VendorPlaylistDto } from '@/playlist/dto/vendor-playlist.dto.js';
import { PlaylistInfo, PlaylistInfoFirstPage, PlaylistType } from '@/playlist/types/types.js';
import { AppleMusicTrackScraper } from '@/track-scraper/applemusic-track-scraper.service.js';
import { SavePlaylistRequestDto } from '@/user/dto/save-playlist-request.dto.js';
import { Authdata } from '@/vendor-account/dto/decrypted-vendor-account.dto.js';
import { TrackInfo } from '@feelin-types/types.js';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { VendorPlaylist, VendorTrack } from '@prisma/client';
import axios from 'axios';
import { playlistUrlsByVendor } from './constants.js';
import { PlaylistScraper } from './playlist-scraper.js';

@Injectable()
export class AppleMusicPlaylistScraper implements PlaylistScraper {
    constructor(private readonly applemusicTrackScraper: AppleMusicTrackScraper) {}

    private readonly playlistUrls = playlistUrlsByVendor['applemusic'];
    private readonly albumCoverSize = 300;
    private readonly playlistCoverSize = 640;

    public async savePlaylist(request: SavePlaylistRequestDto, tracks: VendorTrack[], authdata: Authdata): Promise<string> {
        const createResponse = await axios.post(
            this.playlistUrls.createPlaylist,
            {
                attributes: {
                    name: request.title,
                    description: request.description,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${authdata.adminToken}`,
                    'Music-User-Token': authdata.accessToken,
                    'Content-Type': 'application/json',
                },
            },
        );
        const playlistId = createResponse.data.data[0].id;
        const addTracksBody = tracks.map((track) => ({ id: track.vendorId, type: 'songs' }));
        await axios.post(
            this.playlistUrls.addTracksToPlaylist.replace('{playlistId}', playlistId),
            { data: addTracksBody },
            {
                headers: {
                    Authorization: `Bearer ${authdata.adminToken}`,
                    'Music-User-Token': authdata.accessToken,
                    'Content-Type': 'application/json',
                },
            },
        );

        return `https://music.apple.com/playlist/${playlistId}`;
    }

    async getPlaylist(id: string, adminToken: string, authdata: Authdata): Promise<PlaylistInfo> {
        const { playlistInfo, offsets } = await this.getPlaylistFirstPage(id, adminToken, authdata);
        while (offsets.length > 0) {
            const { tracks, offset } = await this.getPlaylistPage(id, offsets[offsets.length - 1], adminToken, authdata);
            playlistInfo.tracks.push(...tracks);
            if (offset) {
                offsets.push(offset);
            } else {
                break;
            }
        }

        const tracks = await this.applemusicTrackScraper.getTracksByIds(
            playlistInfo.tracks.map(({ id }) => id),
            adminToken,
        );
        playlistInfo.tracks = tracks;
        return playlistInfo;
    }

    private async getPlaylistFirstPage(id: string, adminToken: string, authdata: Authdata): Promise<PlaylistInfoFirstPage> {
        const { type, playlistId } = this.getAppleMusicId(id);
        const headers = { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' };
        if (type === 'user') {
            headers['Music-User-Token'] = authdata.accessToken;
        }

        const response = await axios.get(
            this.playlistUrls.getPlaylist[type].replace('{playlistId}', playlistId).replace('{countryCode}', 'us'),
            { headers },
        );
        const tracks = response.data.data[0].relationships.tracks.data.map((track) =>
            this.applemusicTrackScraper.convertToTrackInfo(track, this.albumCoverSize),
        );

        const offsets = [];
        if (response.data.data[0].relationships.tracks.next) {
            offsets.push(tracks.length);
        }

        return {
            playlistInfo: {
                title: response.data.data[0].attributes.name,
                id: playlistId,
                coverUrl: this.formatCoverUrl(response.data.data[0].attributes.artwork.url, this.playlistCoverSize),
                tracks,
            },
            offsets,
        };
    }

    private async getPlaylistPage(
        id: string,
        offset: number,
        adminToken: string,
        authdata: Authdata,
    ): Promise<{ tracks: TrackInfo[]; offset: number | null }> {
        const { type, playlistId } = this.getAppleMusicId(id);
        const headers = { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' };
        if (type === 'user') {
            headers['Music-User-Token'] = authdata.accessToken;
        }

        const response = await axios.get(
            this.playlistUrls.getPlaylistPaged[type].replace('{playlistId}', playlistId).replace('{countryCode}', 'us'),
            { params: { offset }, headers },
        );

        const tracks = response.data.data.map((track) =>
            this.applemusicTrackScraper.convertToTrackInfo(track, this.albumCoverSize),
        );
        return {
            tracks,
            offset: response.data.next ? offset + tracks.length : null,
        };
    }

    private getAppleMusicId(id: string): { type: PlaylistType; playlistId: string } {
        const [type, playlistId] = id.split(':');

        if (type === 'user') {
            return { type: 'user', playlistId: `p.${playlistId}` };
        } else if (type === 'catalog') {
            return { type: 'catalog', playlistId: `pl.${playlistId}` };
        }
        throw new InternalServerErrorException('Error parsing playlist id');
    }

    private formatCoverUrl(coverUrlFormat: string, size: number): string {
        return coverUrlFormat.replace('{w}x{h}', `${size}x${size}`);
    }

    getVendorPlaylistDto(vendorPlaylist: VendorPlaylist): VendorPlaylistDto {
        return new VendorPlaylistDto(`https://music.apple.com/playlist/${vendorPlaylist.vendorId}`, 'applemusic');
    }
}
