import { SearchResults } from '@/track/types/types.js';
import { TrackInfo } from '@feelin-types/types.js';

export interface TrackScraper {
    searchTrack(track: TrackInfo, authToken: string): Promise<SearchResults>;
    getTracksByIds?(trackIds: string[], authToken: string): Promise<TrackInfo[]>;

    // getMyRecentTracks(authdata: Authdata);
}
