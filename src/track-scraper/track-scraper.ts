import { ITrack } from '@feelin-types/types.js';
import { Authdata } from '@/authdata/types.js';

export interface TrackScraper {
    searchTrack(track: ITrack): Promise<ITrack[]>;

    getMyRecentTracks(authToken: Authdata);
}
