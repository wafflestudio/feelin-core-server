import { Injectable } from '@nestjs/common';
import { StreamService } from '@feelin-types/types.js';
import FloUserScraper from './flo-user-scraper.service.js';
import MelonUserScraper from './melon-user-scraper.service.js';
import UserScraper from './UserScraper.js';

@Injectable()
export class UserScraperService {
    userScrapers: Record<StreamService, UserScraper>;

    constructor(
        private readonly melonUserScraper: MelonUserScraper,
        private readonly floUserScraper: FloUserScraper,
    ) {
        this.userScrapers = {
            melon: melonUserScraper,
            flo: floUserScraper,
        };
    }

    get(streamType: StreamService): UserScraper {
        return this.userScrapers[streamType];
    }
}
