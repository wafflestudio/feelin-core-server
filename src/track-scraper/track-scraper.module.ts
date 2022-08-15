import { AuthdataService } from '@/authdata/authdata.service.js';
import { Module } from '@nestjs/common';
import { FloTrackScraper } from './flo-track-scraper.service.js';
import { MelonTrackScraper } from './melon-track-scraper.service.js';
import { TrackScraperService } from './track-scraper.service.js';

@Module({
    controllers: [],
    providers: [
        MelonTrackScraper,
        FloTrackScraper,
        TrackScraperService,
        AuthdataService,
    ],
    exports: [TrackScraperService, MelonTrackScraper, FloTrackScraper],
})
export class TrackScraperModule {}
