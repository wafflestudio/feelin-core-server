import { Authdata } from '@/vendor-account/dto/decrypted-vendor-account.dto.js';
import { ITrack } from '@feelin-types/types.js';

export interface TrackScraper {
    searchTrack(track: ITrack, authdata: Authdata): Promise<ITrack[]>;

    getMyRecentTracks(authToken: Authdata);
}
