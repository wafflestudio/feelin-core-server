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
        const spotifyAuthData = authData as SpotifyAuthdata;
        const response = await axios.get(this.searchUrl, {
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

        const trackList: ITrack[] = response.data?.tracks?.items?.map((track) => {
            const artists = track.artists.map((artist) => artist.name);
            return {
                title: track.name,
                id: track.id,
                artists: artists,
                album: track.album.name,
            };
        });

        return trackList;
    }

    async getMyRecentTracks(spotifyAuthdata: SpotifyAuthdata) {
        const response = await axios.get(this.recentTrackUrl, {
            headers: {
                Authorization: this.authdataService.toString('spotify', spotifyAuthdata),
                'Content-Type': 'application/json',
            },
        });

        const recentTrackList: ITrack[] = response.data?.items?.map((track) => {
            const artists = track.track.artists.map((artist) => artist.name);
            return {
                title: track.track.name,
                id: track.track.id,
                artists: artists,
                album: track.track.album.name,
            };
        });

        return recentTrackList;
    }
}
