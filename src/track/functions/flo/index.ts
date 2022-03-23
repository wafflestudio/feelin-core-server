import { AuthData, TrackInfo } from 'src/types';
import TrackManager from '../TrackManager';
import searchTrack from './searchTrack';

class FloTrackManager extends TrackManager {
    async searchTrack(track: TrackInfo): Promise<TrackInfo[]> {
        return searchTrack(track);
    }

    async getMyRecentTracks(authToken: AuthData) {}
}

export default FloTrackManager;
