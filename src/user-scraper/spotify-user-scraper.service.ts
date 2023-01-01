import { Authdata, SpotifyAuthdata, SpotifyAuthdataKeys } from '@/authdata/types.js';
import { Injectable } from '@nestjs/common';
import { UserScraper } from './user-scraper.js';
import axios from 'axios';

@Injectable()
export class SpotifyUserScraper implements UserScraper {
    private readonly loginUrl = 'https://api.spotify.com/v1/login';

    async login(username: string, password: string): Promise<SpotifyAuthdata | null> {
        const res = await axios.post(
            this.loginUrl,
            JSON.stringify({
                username: username,
                password: password
            }),
            {
                headers: {
                    'Authorization' : 
                },
            },
        );
        /*if (res.data?.code !== '2000000') {
            return null;
        }*/

        const { accessToken } = res.data?.data || {}; //is there data in data again?
        if (accessToken === undefined) {
            return null;
        }

        return { accessToken };
    }
}
