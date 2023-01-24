import { AuthModule } from '@/auth/auth.module.js';
import { PrismaService } from '@/prisma.service.js';
import { CipherUtilService } from '@/utils/cipher-util/cipher-util.service.js';
import { VendorAccountRepository } from '@/vendor-account/vendor-account.repository.js';
import { Module, forwardRef } from '@nestjs/common';
import { ApplemusicUserScraper } from './applemusic-user-scraper.service.js';
import { FloUserScraper } from './flo-user-scraper.service.js';
import { MelonUserScraper } from './melon-user-scraper.service.js';
import { SpotifyUserScraper } from './spotify-user-scraper.service.js';
import { UserScraperService } from './user-scraper.service.js';

@Module({
    imports: [forwardRef(() => AuthModule)],
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
