import { Authdata } from '@/vendor-account/dto/decrypted-vendor-account.dto.js';
import { VendorAccount } from '@prisma/client';

export interface UserScraper {
    decryptAndRefreshToken(vendorAccount: VendorAccount): Promise<Authdata>;
    getAdminToken(): Promise<string>;
}

export const TOKEN_ADMIN_USER_ID = 'TOKEN_ADMIN';
