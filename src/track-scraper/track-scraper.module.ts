import { AuthdataService } from '@/authdata/authdata.service.js';
import { Module } from '@nestjs/common';
import { AppleMusicTrackScraper } from './applemusic-track-scraper.service.js';
import { FloTrackScraper } from './flo-track-scraper.service.js';
import { MelonTrackScraper } from './melon-track-scraper.service.js';
import { SpotifyTrackScraper } from './spotify-track-scraper.service.js';
import { TrackScraperService } from './track-scraper.service.js';

@Module({
    controllers: [],
    providers: [
        MelonTrackScraper,
        FloTrackScraper,
        SpotifyTrackScraper,
        TrackScraperService,
        AppleMusicTrackScraper,
        AuthdataService,
    ],
    exports: [TrackScraperService, MelonTrackScraper, FloTrackScraper, SpotifyTrackScraper, AppleMusicTrackScraper],
})
export class TrackScraperModule {}
