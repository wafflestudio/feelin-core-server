import { PrismaService } from '@/prisma.service.js';
import { CipherUtilService } from '@/utils/cipher-util/cipher-util.service.js';
import { VendorAccountModule } from '@/vendor-account/vendor-account.module.js';
import { VendorAccountRepository } from '@/vendor-account/vendor-account.repository.js';
import { Module } from '@nestjs/common';
import { ApplemusicUserScraper } from './applemusic-user-scraper.service.js';
import { FloUserScraper } from './flo-user-scraper.service.js';
import { MelonUserScraper } from './melon-user-scraper.service.js';
import { SpotifyUserScraper } from './spotify-user-scraper.service.js';
import { UserScraperService } from './user-scraper.service.js';

@Module({
    imports: [VendorAccountModule],
    providers: [
        UserScraperService,
        MelonUserScraper,
        FloUserScraper,
        SpotifyUserScraper,
        ApplemusicUserScraper,
        VendorAccountRepository,
        PrismaService,
        CipherUtilService,
    ],
    exports: [UserScraperService, MelonUserScraper, FloUserScraper, SpotifyUserScraper, ApplemusicUserScraper],
})
export class UserScraperModule {}
