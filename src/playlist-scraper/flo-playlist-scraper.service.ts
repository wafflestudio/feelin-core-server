import { AuthdataService } from '@/authdata/authdata.service.js';
import { Authdata, FloAuthdata } from '@/authdata/types.js';
import { IPlaylist } from '@/playlist/types/types.js';
import { VendorTrackRepository } from '@/track/vendor-track.repository.js';
import { SavePlaylistRequestDto } from '@/user/dto/save-playlist-request.dto.js';
import { ITrack } from '@feelin-types/types.js';
import { Injectable } from '@nestjs/common';
import { Track } from '@prisma/client';
import axios from 'axios';
import { PlaylistScraper } from './playlist-scraper.js';

@Injectable()
export class FloPlaylistScraper implements PlaylistScraper {
    private readonly playlistUrl = {
        user: 'https://api.music-flo.com/personal/v1/playlist/',
        dj: 'https://api.music-flo.com/meta/v1/channel/',
    };
    private readonly createPlaylistUrl = 'https://www.music-flo.com/api/personal/v1/myplaylist';

    constructor(
        private readonly authdataService: AuthdataService,
        private readonly vendorTrackRepository: VendorTrackRepository,
    ) {}

    async getPlaylist(playlistId: string): Promise<IPlaylist> {
        const [type, id] = playlistId.split(':');
        if (type != 'user' && type != 'dj') {
            // FIXME: Better error message
            throw new Error('Not supported playlist type');
        }
        const res = await axios.get(this.playlistUrl[type] + id);
        const playlistData = res.data?.data;

        let trackList;
        if (type == 'user') {
            trackList = playlistData?.track?.list;
        } else if (type == 'dj') {
            trackList = playlistData?.trackList;
        }

        const tracks: ITrack[] = trackList?.map(({ name, id, album, artistList }) => ({
            vendor: 'flo',
            title: name,
            id,
            artists: artistList?.map(({ id, name }) => ({ vendor: 'flo', id, name })),
            album: {
                vendor: 'flo',
                title: album?.title,
                id: album?.id,
                coverUrl: this.formatCoverUrl(
                    album?.img.urlFormat,
                    album?.img?.availableSizeList[Math.floor(album?.img?.availableSizeList?.length / 2)],
                ),
            },
        }));

        return {
            vendor: 'flo',
            title: playlistData?.name,
            id: playlistId,
            tracks,
        };
    }

    public async savePlaylist(request: SavePlaylistRequestDto, tracks: Track[], authData: Authdata) {
        const floAuthData = authData as FloAuthdata;
        const createResponse = await axios.post(
            this.createPlaylistUrl,
            {
                memberChannelName: request.title,
            },
            {
                headers: {
                    Cookie: this.authdataService.toString('flo', floAuthData),
                    'x-gm-access-token': floAuthData.accessToken,
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
            this.createPlaylistUrl + `/${playlistId}/tracks`,
            {
                trackIdList: trackIds,
            },
            {
                headers: {
                    Cookie: this.authdataService.toString('flo', floAuthData),
                    'x-gm-access-token': floAuthData.accessToken,
                },
            },
        );
        if (addResponse.data?.code !== '2000000') {
            return null;
        }
    }

    protected formatCoverUrl(coverUrlFormat: string, size: number): string {
        return coverUrlFormat.replace(/{size}/, `${size}x${size}`);
    }
}
