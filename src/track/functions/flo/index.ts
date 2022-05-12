import { AuthData, JwtTokenPair, TrackInfo } from 'src/types';
import TrackManager from '../TrackManager';
import getMyRecentTracks from './getMyRecentTracks';
import searchTrack from './searchTrack';

class FloTrackManager extends TrackManager {
    async searchTrack(track: TrackInfo): Promise<TrackInfo[]> {
        return searchTrack(track);
    }

    async getMyRecentTracks(authToken: AuthData) {
        return getMyRecentTracks(authToken as JwtTokenPair);
    }
}

export default FloTrackManager;
