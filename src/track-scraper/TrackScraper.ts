import { TrackInfo } from '@feelin-types/types.js';
import { Authdata } from '@/authdata/types';

export interface TrackScraper {
    // Not the best way to pass entity around
    searchTrack(track: TrackInfo): Promise<TrackInfo[]>;

    getMyRecentTracks(authToken: Authdata);
}
