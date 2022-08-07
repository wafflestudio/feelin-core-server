import { Injectable } from '@nestjs/common';
import { StreamService } from '@feelin-types/types.js';
import FloTrackScraper from './flo/index.js';
import MelonTrackScraper from './melon/index.js';
import TrackScraper from './TrackScraper.js';

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
