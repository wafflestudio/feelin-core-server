import { Injectable } from '@nestjs/common';
import { StreamService } from 'src/types';
import FloTrackScraper from './flo';
import MelonTrackScraper from './melon';
import TrackScraper from './TrackScraper';

@Injectable()
export class TrackScraperService {
    trackScrapers: { [key in StreamService]: TrackScraper };

    constructor(
        private readonly melonTrackScraper: MelonTrackScraper,
        private readonly floTrackScraper: FloTrackScraper,
    ) {
        this.trackScrapers = {
            melon: melonTrackScraper,
            flo: floTrackScraper,
        };
    }

    get(streamType: StreamService): TrackScraper {
        return this.trackScrapers[streamType];
    }
}
