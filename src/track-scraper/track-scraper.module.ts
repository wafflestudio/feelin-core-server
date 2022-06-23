import { Module } from '@nestjs/common';
import FloTrackScraper from './flo';
import MelonTrackScraper from './melon';
import { TrackScraperService } from './track-scraper.service';

@Module({
    controllers: [],
    providers: [MelonTrackScraper, FloTrackScraper, TrackScraperService],
    exports: [TrackScraperService],
})
export class TrackScraperModule {}
