import { StreamService } from './StreamService';

class JwtTokenPair {
    accessToken: string;
    refreshToken: string;

    constructor(accessToken: string, refreshToken: string) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    toCookieString(streamType: StreamService): string {
        let cookies = [];
        if (streamType === 'flo') {
            cookies.push(
                `FLO_AUT=${this.accessToken}`,
                `FLO_RFT=${this.refreshToken}`,
            );
        }
        return cookies.join('; ');
    }
}

export default JwtTokenPair;
