import { Module } from '@nestjs/common';
import FloUserScraper from './flo/index.js';
import MelonUserScraper from './melon/index.js';
import { UserScraperService } from './user-scraper.service.js';

@Module({
    providers: [UserScraperService, MelonUserScraper, FloUserScraper],
    exports: [UserScraperService],
})
export class UserScraperModule {}
