import { Injectable } from '@nestjs/common';
import { UserScraper } from './user-scraper.js';

@Injectable()
export class SpotifyUserScraper implements UserScraper {
    async login(id: string, password: string) {
        return null;
    }
}
