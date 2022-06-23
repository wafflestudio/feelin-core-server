import { Injectable } from '@nestjs/common';
import { AuthData, JwtTokenPair, TrackInfo } from 'src/types';
import TrackScraper from '../TrackScraper';
import getMyRecentTracks from './getMyRecentTracks';
import searchTrack from './searchTrack';

@Injectable()
class FloTrackScraper extends TrackScraper {
    async searchTrack(track: TrackInfo): Promise<TrackInfo[]> {
        return searchTrack(track);
    }

    async getMyRecentTracks(authToken: AuthData) {
        return getMyRecentTracks(authToken as JwtTokenPair);
    }
}

export default FloTrackScraper;
