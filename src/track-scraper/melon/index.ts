import { Injectable } from '@nestjs/common';
import { Track } from 'src/track/track.entity';
import { AuthData, CookieData, TrackInfo } from 'src/types';
import TrackScraper from '../TrackScraper';
import getMyRecentTracks from './getMyRecentTracks';
import getTrack from './getTrack';
import scrapeMyMusicTrack from './scrapeMyMusicTrack';
import scrapeTrack from './scrapeTrack';
import searchTrack from './searchTrack';

@Injectable()
class MelonTrackScraper extends TrackScraper {
    async searchTrack(track: TrackInfo): Promise<TrackInfo[]> {
        return searchTrack(track);
    }

    async getMyRecentTracks(authToken: AuthData) {
        return getMyRecentTracks(authToken as CookieData);
    }

    async getTrack(trackId: string): Promise<Track> {
        return getTrack(trackId);
    }
}

// Functions specific to the melon service
const MelonTrackUtils = {
    scrapeMyMusicTrack,
    scrapeTrack,
};

export default MelonTrackScraper;
export { MelonTrackUtils };
