import { AuthdataService } from '@/authdata/authdata.service.js';
import { Module } from '@nestjs/common';
import { FloTrackScraper } from './flo-track-scraper.service.js';
import { MelonTrackScraper } from './melon-track-scraper.service.js';
import { SpotifyTrackScraper } from './spotify-track-scraper.service.js';
import { TrackScraperService } from './track-scraper.service.js';

@Module({
    controllers: [],
    providers: [MelonTrackScraper, FloTrackScraper, SpotifyTrackScraper, TrackScraperService, AuthdataService],
    exports: [TrackScraperService, MelonTrackScraper, FloTrackScraper, SpotifyTrackScraper],
})
export class TrackScraperModule {}
