import { AuthData, TrackInfo } from 'src/types';
import TrackManager from '../TrackManager';
import scrapeMyMusicTrack from './scrapeMyMusicTrack';
import scrapeTrack from './scrapeTrack';
import searchTrack from './searchTrack';

class MelonTrackManager extends TrackManager {
    async searchTrack(track: TrackInfo): Promise<TrackInfo[]> {
        return searchTrack(track);
    }

    async getMyRecentTracks(authToken: AuthData) {}
}

// Functions specific to the melon service
const MelonTrackUtils = {
    scrapeMyMusicTrack,
    scrapeTrack,
};

export { MelonTrackManager, MelonTrackUtils };
