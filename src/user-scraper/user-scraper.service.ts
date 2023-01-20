import { Vendors } from '@feelin-types/types.js';
import { Injectable } from '@nestjs/common';
import { ApplemusicUserScraper } from './applemusic-user-scraper.service.js';
import { FloUserScraper } from './flo-user-scraper.service.js';
import { MelonUserScraper } from './melon-user-scraper.service.js';
import { SpotifyUserScraper } from './spotify-user-scraper.service.js';
import { UserScraper } from './user-scraper.js';

@Injectable()
export class UserScraperService {
    userScrapers: Record<Vendors, UserScraper>;

    constructor(
        private readonly melonUserScraper: MelonUserScraper,
        private readonly floUserScraper: FloUserScraper,
        private readonly spotifyUserScraper: SpotifyUserScraper,
        private readonly applemusicUserScraper: ApplemusicUserScraper,
    ) {
        this.userScrapers = {
            melon: melonUserScraper,
            flo: floUserScraper,
            spotify: spotifyUserScraper,
            applemusic: applemusicUserScraper,
        };
    }

    get(vendor: Vendors): UserScraper {
        return this.userScrapers[vendor];
    }
}
