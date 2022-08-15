import AuthdataService from '@/authdata/authdata.service.js';
import { FloAuthdata } from '@/authdata/types.js';
import { TrackInfo } from '@/types/types.js';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import TrackScraper from './TrackScraper.js';

@Injectable()
class FloTrackScraper implements TrackScraper {
    private readonly searchUrl =
        'https://www.music-flo.com/api/search/v2/search';
    private readonly recentTrackUrl =
        'https://www.music-flo.com/api/personal/v1/tracks/recentlistened';

    constructor(protected readonly authdataService: AuthdataService) {}

    async searchTrack(track: TrackInfo): Promise<TrackInfo[]> {
        // Flo search API limits max 250 results at once
        const response = await axios.get(this.searchUrl, {
            params: {
                keyword: track.title,
                searchType: 'TRACK',
                sortType: 'ACCURACY',
                size: 100,
                page: 1,
            },
        });

        const trackList: TrackInfo[] = response.data?.data?.list[0]?.list?.map(
            (track) => {
                const { id, name, artistList, album } = track;
                const artists = artistList.map((artist) => artist.name);
                return {
                    streamType: 'flo',
                    title: name,
                    streamId: id,
                    artists: artists,
                    album: album.title,
                };
            },
        );
        return trackList;
    }

    async getMyRecentTracks(floAuthdata: FloAuthdata) {
        const res = await axios.get(this.recentTrackUrl, {
            headers: {
                Cookie: this.authdataService.toString('flo', floAuthdata),
                'x-gm-access-token': floAuthdata.accessToken,
            },
        });
        console.log(res);
    }
}

export default FloTrackScraper;
