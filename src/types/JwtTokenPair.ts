import AuthData from './AuthData';
import { StreamService } from './StreamService';

class JwtTokenPair extends AuthData {
    accessToken: string;
    refreshToken: string;

    constructor(accessToken: string, refreshToken: string) {
        super();
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    toString(streamType: StreamService): string {
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
