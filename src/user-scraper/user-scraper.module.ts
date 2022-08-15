import { Module } from '@nestjs/common';
import FloUserScraper from './flo-user-scraper.service.js';
import MelonUserScraper from './melon-user-scraper.service.js';
import { UserScraperService } from './user-scraper.service.js';

@Module({
    providers: [UserScraperService, MelonUserScraper, FloUserScraper],
    exports: [UserScraperService, MelonUserScraper, FloUserScraper],
})
export class UserScraperModule {}
