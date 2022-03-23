import { AuthData, TrackInfo } from 'src/types';

abstract class TrackManager {
    // Not the best way to pass entity around
    async searchTrack(track: TrackInfo): Promise<TrackInfo[]> {
        return [track];
    }

    async getMyRecentTracks(authToken: AuthData) {}
}

export default TrackManager;
