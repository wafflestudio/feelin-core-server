import { Injectable } from '@nestjs/common';
import { StreamService } from 'src/types';
import FloUserScraper from './flo';
import MelonUserScraper from './melon';
import UserScraper from './UserScraper';

@Injectable()
export class UserScraperService {
    userScrapers: { [key in StreamService]: UserScraper };

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
