import { Injectable } from '@nestjs/common';
import { UserScraper } from './user-scraper.js';

@Injectable()
export class FloUserScraper implements UserScraper {
    async login(id: string, password: string) {
        return null;
    }
}
