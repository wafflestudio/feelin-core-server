import { Authdata } from '@/vendor-account/dto/decrypted-vendor-account.dto.js';
import { ITrack } from '@feelin-types/types.js';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { trackUrlsByVendor } from './constants.js';
import { TrackScraper } from './track-scraper.js';

@Injectable()
export class FloTrackScraper implements TrackScraper {
    constructor() {}

    private readonly trackUrls = trackUrlsByVendor['flo'];

    async searchTrack(track: ITrack): Promise<ITrack[]> {
        // Flo search API limits max 250 results at once
        const response = await axios.get(this.trackUrls.search, {
            params: {
                keyword: track.title,
                searchType: 'TRACK',
                sortType: 'ACCURACY',
                size: 100,
                page: 1,
            },
        });

        const trackList: ITrack[] = response.data?.data?.list[0]?.list?.map((track) => {
            const { id, name, artistList, album } = track;
            const artists = artistList.map((artist) => artist.name);
            return {
                vendor: 'flo',
                title: name,
                vendorId: id,
                artists: artists,
                album: album.title,
            };
        });
        return trackList;
    }

    async getMyRecentTracks(authdata: Authdata) {
        const res = await axios.get(this.trackUrls.recentlyPlayed, {
            headers: {
                Cookie: `access_token=${authdata.accessToken};refresh_token=${authdata.refreshToken};`,
                'x-gm-access-token': authdata.accessToken,
            },
        });
    }
}
