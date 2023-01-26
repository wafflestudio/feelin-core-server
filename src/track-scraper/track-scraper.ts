import { SearchResults } from '@/track/types/types.js';
import { TrackInfo } from '@feelin-types/types.js';

export interface TrackScraper {
    searchTrack(track: TrackInfo, adminToken: string): Promise<SearchResults>;
    getTracksByIds?(trackIds: string[], adminToken: string): Promise<TrackInfo[]>;

    // getMyRecentTracks(authdata: Authdata);
}
