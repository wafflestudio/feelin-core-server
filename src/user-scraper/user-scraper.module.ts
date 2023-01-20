import { Module } from '@nestjs/common';
import { ApplemusicUserScraper } from './applemusic-user-scraper.service.js';
import { FloUserScraper } from './flo-user-scraper.service.js';
import { MelonUserScraper } from './melon-user-scraper.service.js';
import { SpotifyUserScraper } from './spotify-user-scraper.service.js';
import { UserScraperService } from './user-scraper.service.js';

@Module({
    providers: [UserScraperService, MelonUserScraper, FloUserScraper, SpotifyUserScraper, ApplemusicUserScraper],
    exports: [UserScraperService, MelonUserScraper, FloUserScraper, SpotifyUserScraper, ApplemusicUserScraper],
})
export class UserScraperModule {}
