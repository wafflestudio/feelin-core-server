import { Injectable } from '@nestjs/common';
import { UserScraper } from './user-scraper.js';

@Injectable()
export class MelonUserScraper implements UserScraper {
    async login(id: string, password: string) {
        return null;
    }
}
