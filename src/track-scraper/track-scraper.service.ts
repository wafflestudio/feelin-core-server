import { Vendors } from '@feelin-types/types.js';
import { Injectable } from '@nestjs/common';
import { AppleMusicTrackScraper } from './applemusic-track-scraper.service.js';
import { FloTrackScraper } from './flo-track-scraper.service.js';
import { MelonTrackScraper } from './melon-track-scraper.service.js';
import { SpotifyTrackScraper } from './spotify-track-scraper.service.js';
import { TrackScraper } from './track-scraper.js';

@Injectable()
export class TrackScraperService {
    trackScrapers: { [key in Vendors]: TrackScraper };

    constructor(
        private readonly melonTrackScraper: MelonTrackScraper,
        private readonly floTrackScraper: FloTrackScraper,
        private readonly spotifyTrackScraper: SpotifyTrackScraper,
        private readonly appleMusicTrackScraper: AppleMusicTrackScraper,
    ) {
        this.trackScrapers = {
            melon: melonTrackScraper,
            flo: floTrackScraper,
            spotify: spotifyTrackScraper,
            applemusic: appleMusicTrackScraper,
        };
    }

    get(vendor: Vendors): TrackScraper {
        return this.trackScrapers[vendor];
    }
}
