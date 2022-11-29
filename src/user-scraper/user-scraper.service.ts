import { Injectable } from '@nestjs/common';
import { Vendors } from '@feelin-types/types.js';
import { FloUserScraper } from './flo-user-scraper.service.js';
import { MelonUserScraper } from './melon-user-scraper.service.js';
import { UserScraper } from './user-scraper.js';

@Injectable()
export class UserScraperService {
    userScrapers: Record<Vendors, UserScraper>;

    constructor(private readonly melonUserScraper: MelonUserScraper, private readonly floUserScraper: FloUserScraper) {
        this.userScrapers = {
            melon: melonUserScraper,
            flo: floUserScraper,
        };
    }

    get(vendor: Vendors): UserScraper {
        return this.userScrapers[vendor];
    }
}
