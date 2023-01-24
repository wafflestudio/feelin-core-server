import { Authdata } from '@/vendor-account/dto/decrypted-vendor-account.dto.js';
import { Injectable } from '@nestjs/common';
import { VendorAccount } from '@prisma/client';
import { UserScraper } from './user-scraper.js';

@Injectable()
export class MelonUserScraper implements UserScraper {
    decryptAndRefreshToken(vendorAccount: VendorAccount): Promise<Authdata> {
        throw new Error('Method not implemented.');
    }

    getAdminToken(): Promise<string> {
        throw new Error('Method not implemented.');
    }
}
