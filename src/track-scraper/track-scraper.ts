import { SearchResults } from '@/track/types/types.js';
import { TrackInfo } from '@feelin-types/types.js';

export interface TrackScraper {
    searchTrack(track: TrackInfo, authToken: string): Promise<SearchResults>;

    // getMyRecentTracks(authdata: Authdata);
}
