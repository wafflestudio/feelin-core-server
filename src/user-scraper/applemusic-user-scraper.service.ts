import { ApplemusicAuthdata } from '@/authdata/types.js';
import { Injectable } from '@nestjs/common';
import { UserScraper } from './user-scraper.js';

@Injectable()
export class ApplemusicUserScraper implements UserScraper {
    async login(id: string, password: string): Promise<ApplemusicAuthdata | null> {
        return null;
    }
}