import { AuthdataService } from '@/authdata/authdata.service.js';
import { Authdata, FloAuthdata } from '@/authdata/types.js';
import { Playlist } from '@/playlist/entity/playlist.entity.js';
import { IPlaylist } from '@/playlist/types/types.js';
import { Track } from '@/track/entity/track.entity.js';
import { TrackService } from '@/track/track.service.js';
import { ITrack } from '@feelin-types/types.js';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PlaylistScraper } from './PlaylistScraper.js';

@Injectable()
export class FloPlaylistScraper implements PlaylistScraper {
    private readonly playlistUrl = {
        user: 'https://api.music-flo.com/personal/v1/playlist/',
        dj: 'https://api.music-flo.com/meta/v1/channel/',
    };
    private readonly createPlaylistUrl = 'https://www.music-flo.com/api/personal/v1/myplaylist';

    constructor(protected readonly authdataService: AuthdataService, protected readonly trackService: TrackService) {}

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

        const tracks: ITrack[] = trackList?.map((trackData) => {
            const { name, id, album, artistList } = trackData;
            return {
                vendor: 'flo',
                name,
                id,
                artists: artistList?.map(({ id, name }) => ({ vendor: 'flo', id, name })),
                album: {
                    vendor: 'flo',
                    name: album?.title,
                    id: album?.id,
                },
            };
        });

        return {
            vendor: 'flo',
            title: playlistData?.title,
            id,
            tracks,
        };
    }

    public async savePlaylist(playlist: Playlist, tracks: Track[], authData: Authdata) {
        const floAuthData = authData as FloAuthdata;
        const createResponse = await axios.post(
            this.createPlaylistUrl,
            {
                memberChannelName: playlist.title,
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
        const streamTracks = await this.trackService.findAllStreamTracks(tracks);
        const trackIds = tracks
            .map(
                (track) =>
                    streamTracks.find((streamTrack) => streamTrack.track === track && streamTrack.vendor === 'flo')
                        ?.vendorId,
            )
            .filter((id) => id !== null); // Filter out un-found tracks

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
}
