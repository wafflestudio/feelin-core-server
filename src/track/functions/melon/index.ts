import { Track } from 'src/track/track.entity';
import { AuthData, TrackInfo } from 'src/types';
import TrackManager from '../TrackManager';
import getTrack from './getTrack';
import scrapeMyMusicTrack from './scrapeMyMusicTrack';
import scrapeTrack from './scrapeTrack';
import searchTrack from './searchTrack';

class MelonTrackManager extends TrackManager {
    async searchTrack(track: TrackInfo): Promise<TrackInfo[]> {
        return searchTrack(track);
    }

    async getMyRecentTracks(authToken: AuthData) {}

    async getTrack(trackId: string): Promise<Track> {
        return getTrack(trackId);
    }
}

// Functions specific to the melon service
const MelonTrackUtils = {
    scrapeMyMusicTrack,
    scrapeTrack,
};

export default MelonTrackManager;
export { MelonTrackUtils };
