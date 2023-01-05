import { AuthdataService } from '@/authdata/authdata.service.js';
import { Authdata, SpotifyAuthdata, SpotifyAuthdataKeys } from '@/authdata/types.js';
import { ITrack } from '@/types/types.js';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { TrackScraper } from './track-scraper.js';

@Injectable()
export class SpotifyTrackScraper implements TrackScraper {
    private readonly searchUrl = 'https://api.spotify.com/v1/search';
    private readonly recentTrackUrl = 'https://api.spotify.com/v1/me/player/recently-played';

    constructor(private readonly authdataService: AuthdataService) {}

    async searchTrack(track: ITrack, authData: Authdata): Promise<ITrack[]> {
        // TODO: Implement me
        const spotifyAuthData = authData as SpotifyAuthdata;
        const response = await axios.get(this.searchUrl + track.title, {
            params: {
                q: track.title,
                type: 'track',
                include_external: 'audio',
                limit: 50,
                offset: 0,
            },
            headers: {
                Authorization: this.authdataService.toString('spotify', spotifyAuthData),
                'Content-Type': 'application/json',
            },
        });

        const trackList: ITrack[] = response.data?.data?.list[0]?.list?.map((track) => {
            const { id, name, artistList, album } = track;
            const artists = artistList.map((artist) => artist.name);
            return {
                vendor: 'spotify',
                title: name,
                vendorId: id,
                artists: artists,
                album: album.title,
            };
        });

        return trackList;
    }

    async getMyRecentTracks(spotifyAuthdata: SpotifyAuthdata) {
        // TODO: Implement me
        const res = await axios.get(this.recentTrackUrl, {
            headers: {
                Authorization: this.authdataService.toString('spotify', spotifyAuthdata),
                'Content-Type': 'application/json',
            },
        });
        console.log(res);
    }
}
