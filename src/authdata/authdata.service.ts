import { Vendors } from '@feelin-types/types.js';
import { Injectable } from '@nestjs/common';
import { Authdata, FloAuthdataKeys, MelonAuthdataKeys, SpotifyAuthdataKeys, ApplemusicAuthdataKeys } from './types.js';

@Injectable()
export class AuthdataService {
    private authdataKeys: Record<Vendors, string[]>;

    constructor() {
        this.authdataKeys = {
            melon: MelonAuthdataKeys,
            flo: FloAuthdataKeys,
            spotify: SpotifyAuthdataKeys,
            applemusic: ApplemusicAuthdataKeys,
        };
    }

    fromString(streamType: Vendors, cookieString: string): Authdata {
        const authdataKeys = this.authdataKeys[streamType];

        const cookies = cookieString.split('; ').reduce((cookieData, cookie) => {
            const splitCookie = cookie.split('=');
            if (splitCookie.length != 2) {
                throw new Error('AuthData malformed ' + { vendor: streamType });
            }
            const [key, value] = splitCookie;
            cookieData[key] = value;
            return cookieData;
        }, {});

        const authdata = {};
        for (const key of authdataKeys) {
            if (cookies[key] === undefined) {
                throw new Error('AuthData has missing values ' + { vendor: streamType });
            }
            authdata[key] = cookies[key];
        }

        return authdata as Authdata;
    }

    toString(streamType: Vendors, authdata: Authdata): string {
        const cookies: string[] = [];
        for (const key of this.authdataKeys[streamType]) {
            if (authdata[key] === undefined) {
                throw new Error('AuthData has missing values ' + { vendor: streamType });
            }
            cookies.push(`${key}=${authdata[key]}`);
        }
        return cookies.join('; ');
    }
}
