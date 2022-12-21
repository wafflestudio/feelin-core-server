import { Authdata } from '@/authdata/types.js';
import { ITrack } from '@/types/types.js';
import { Injectable } from '@nestjs/common';
import { TrackScraper } from './track-scraper.js';

@Injectable()
export class SpotifyTrackScraper implements TrackScraper {
    searchTrack(track: ITrack): Promise<ITrack[]> {
        // TODO: Implement me
        return null;
    }

    getMyRecentTracks(authToken: Authdata) {
        // TODO: Implement me
        return null;
    }
}
