import { SpotifyAuthdata } from '@/authdata/types.js';
import { Injectable } from '@nestjs/common';
import { UserScraper } from './user-scraper.js';
import axios from 'axios';

@Injectable()
export class SpotifyUserScraper implements UserScraper {
    private readonly loginUrl = '';

    async login(): Promise<SpotifyAuthdata | null> {
        return;
    }
}
