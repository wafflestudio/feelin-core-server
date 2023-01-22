import { PlaylistInfo } from '@/playlist/types/types.js';
import { VendorTrackRepository } from '@/track/vendor-track.repository.js';
import { SavePlaylistRequestDto } from '@/user/dto/save-playlist-request.dto.js';
import { Authdata } from '@/vendor-account/dto/decrypted-vendor-account.dto.js';
import { TrackInfo } from '@feelin-types/types.js';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Track } from '@prisma/client';
import axios from 'axios';
import { playlistUrlsByVendor } from './constants.js';
import { PlaylistScraper } from './playlist-scraper.js';

@Injectable()
export class FloPlaylistScraper implements PlaylistScraper {
    constructor(private readonly vendorTrackRepository: VendorTrackRepository) {}

    private readonly playlistUrls = playlistUrlsByVendor['flo'];

    async getPlaylist(playlistId: string, authdata: Authdata): Promise<PlaylistInfo> {
        const [type, id] = playlistId.split(':');
        if (type != 'user' && type != 'catalog') {
            throw new InternalServerErrorException('Invalid playlist id');
        }
        const res = await axios.get(`${this.playlistUrls.getPlaylist[type]}/${id}`);
        const playlistData = res.data?.data;

        let trackList;
        if (type == 'user') {
            trackList = playlistData?.track?.list;
        } else if (type == 'catalog') {
            trackList = playlistData?.trackList;
        }

        const tracks: TrackInfo[] = trackList?.map(({ name, id, album, artistList }) => ({
            vendor: 'flo',
            title: name,
            id: String(id),
            artists: artistList?.map(({ id, name }) => ({ vendor: 'flo', id: String(id), name })),
            album: {
                vendor: 'flo',
                title: album?.title,
                id: String(album?.id),
                coverUrl: this.formatCoverUrl(
                    album?.img.urlFormat,
                    album?.img?.availableSizeList[Math.floor(album?.img?.availableSizeList?.length / 2)],
                ),
            },
        }));

        return {
            title: playlistData?.name,
            id: playlistId,
            coverUrl: '',
            tracks,
        };
    }

    public async savePlaylist(request: SavePlaylistRequestDto, tracks: Track[], authdata: Authdata) {
        const createResponse = await axios.post(
            this.playlistUrls.createPlaylist,
            {
                memberChannelName: request.title,
            },
            {
                headers: {
                    Cookie: this.getCookieString(authdata),
                    'x-gm-access-token': authdata.accessToken,
                },
            },
        );
        if (createResponse.data?.code !== '2000000') {
            return null;
        }

        const playlistId = createResponse.data?.data?.id;
        const vendorTracks = await this.vendorTrackRepository.findAllWithTrackByIdAndVendor(
            'flo',
            tracks.map(({ id }) => id),
        );

        const trackIds = tracks.map(({ id }) => vendorTracks[id]?.vendorId).filter((id) => !!id);

        const addResponse = await axios.post(
            this.playlistUrls.addTracksToPlaylist.replace('{playlistId}', playlistId),
            {
                trackIdList: trackIds,
            },
            {
                headers: {
                    Cookie: this.getCookieString(authdata),
                    'x-gm-access-token': authdata.accessToken,
                },
            },
        );
        if (addResponse.data?.code !== '2000000') {
            return null;
        }
    }

    private getCookieString(authdata: Authdata) {
        return `access_token=${authdata.accessToken};refresh_token=${authdata.refreshToken}`;
    }

    private formatCoverUrl(coverUrlFormat: string, size: number): string {
        return coverUrlFormat.replace(/{size}/, `${size}x${size}`);
    }
}
