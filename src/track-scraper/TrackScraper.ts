import { ITrack } from '@feelin-types/types.js';
import { Authdata } from '@/authdata/types.js';

export interface TrackScraper {
    // Not the best way to pass entity around
    searchTrack(track: ITrack): Promise<ITrack[]>;

    getMyRecentTracks(authToken: Authdata);
}
