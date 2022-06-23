import { AuthData, TrackInfo } from 'src/types';

abstract class TrackScraper {
    // Not the best way to pass entity around
    abstract searchTrack(track: TrackInfo): Promise<TrackInfo[]>;

    abstract getMyRecentTracks(authToken: AuthData);
}

export default TrackScraper;
