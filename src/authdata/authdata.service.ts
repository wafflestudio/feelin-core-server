import { StreamService } from '@feelin-types/types';
import { Injectable } from '@nestjs/common';
import { Authdata, MelonAuthdataKeys, FloAuthdataKeys } from './types.js';

@Injectable()
export default class AuthdataService {
    private authdataKeys: Record<StreamService, string[]>;

    constructor() {
        this.authdataKeys = {
            melon: MelonAuthdataKeys,
            flo: FloAuthdataKeys,
        };
    }

    fromString(streamType: StreamService, cookieString: string): Authdata {
        const authdataKeys = this.authdataKeys[streamType];

        const cookies = cookieString
            .split('; ')
            .reduce((cookieData, cookie) => {
                const splitCookie = cookie.split('=');
                if (splitCookie.length != 2) {
                    throw new Error(
                        'AuthData malformed ' + { vendor: streamType },
                    );
                }
                const [key, value] = splitCookie;
                cookieData[key] = value;
                return cookieData;
            }, {});

        const authdata = {};
        for (const key of authdataKeys) {
            if (cookies[key] === undefined) {
                throw new Error(
                    'AuthData has missing values ' + { vendor: streamType },
                );
            }
            authdata[key] = cookies[key];
        }

        return authdata as Authdata;
    }

    toString(streamType: StreamService, authdata: Authdata): string {
        const cookies: string[] = [];
        for (const key of this.authdataKeys[streamType]) {
            if (authdata[key] === undefined) {
                throw new Error(
                    'AuthData has missing values ' + { vendor: streamType },
                );
            }
            cookies.push(`${key}=${authdata[key]}`);
        }
        return cookies.join('; ');
    }
}
