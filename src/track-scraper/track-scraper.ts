import { Authdata } from '@/vendor-account/dto/decrypted-vendor-account.dto.js';
import { TrackInfo } from '@feelin-types/types.js';

export interface TrackScraper {
    searchTrack(track: TrackInfo, authdata: Authdata): Promise<TrackInfo[]>;

    getMyRecentTracks(authToken: Authdata);
}
