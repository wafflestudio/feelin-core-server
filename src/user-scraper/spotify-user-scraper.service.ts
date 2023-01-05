import { SpotifyAuthdata } from '@/authdata/types.js';
import { Injectable } from '@nestjs/common';
import { UserScraper } from './user-scraper.js';
import axios from 'axios';

@Injectable()
export class SpotifyUserScraper implements UserScraper {
    private readonly loginUrl = 'https://accounts.spotify.com/authorize';

    CLIENT_ID = 'CLIENT_ID';
    REDIRECT_URI = 'REDIRECT_URI';
    SCOPE = 'SCOPE';
    STATE = 'STATE';
    /*
    'https://accounts.spotify.com/authorize?' +
                JSON.stringify({
                    response_type: 'code',
                    client_id: this.CLIENT_ID,
                    scope: this.SCOPE,
                    redirect_uri: this.REDIRECT_URI,
                    state: this.STATE,
                }),
    */

    async login(): Promise<SpotifyAuthdata | null> {
        const res = await axios.post(
            this.loginUrl,
            {},
            {
                headers: {},
            },
        );
        /*if (res.data?.code !== '2000000') {
            return null;
        }*/

        const { accessToken } = res.data?.data || {};
        if (accessToken === undefined) {
            return null;
        }

        return { accessToken };
    }
}
