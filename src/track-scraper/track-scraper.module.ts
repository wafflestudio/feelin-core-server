import { ApplemusicArtistScraper } from '@/artist-scraper/applemusic-artist-scraper.service.js';
import { CookieUtilService } from '@/utils/cookie-util/cookie-util.service.js';
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
        ApplemusicArtistScraper,
        CookieUtilService,
    ],
    exports: [TrackScraperService, MelonTrackScraper, FloTrackScraper, SpotifyTrackScraper, AppleMusicTrackScraper],
})
export class TrackScraperModule {}
