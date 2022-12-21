import { Authdata } from '@/authdata/types.js';
import { Injectable } from '@nestjs/common';
import { UserScraper } from './user-scraper.js';

@Injectable()
export class SpotifyUserScraper implements UserScraper {
    login(id: string, password: string): Promise<Authdata> {
        // TODO: Implement me
        return null;
    }
}
