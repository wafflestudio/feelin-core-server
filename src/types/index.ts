import TrackInfo from './TrackInfo';
import CookieData from './CookieData';
import { StreamService, StreamServiceEnum } from './StreamService';
import JwtTokenPair from './JwtTokenPair';

type AuthInfo = CookieData | JwtTokenPair;

export {
    TrackInfo,
    CookieData,
    JwtTokenPair,
    AuthInfo,
    StreamServiceEnum,
    StreamService,
};
