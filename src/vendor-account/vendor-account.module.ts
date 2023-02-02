import { AuthModule } from '@/auth/auth.module.js';
import { PrismaService } from '@/prisma.service.js';
import { UserScraperModule } from '@/user-scraper/user-scraper.module.js';
import { CipherUtilService } from '@/utils/cipher-util/cipher-util.service.js';
import { VendorAccountRepository } from '@/vendor-account/vendor-account.repository.js';
import { Module, forwardRef } from '@nestjs/common';
import { VendorAccountCipherUtilService } from './vendor-account-cipher-util.service.js';
import { VendorAccountController } from './vendor-account.controller.js';
import { VendorAccountService } from './vendor-account.service.js';

@Module({
    imports: [forwardRef(() => AuthModule), forwardRef(() => UserScraperModule)],
    providers: [VendorAccountService, VendorAccountRepository, VendorAccountCipherUtilService, PrismaService, CipherUtilService],
    exports: [VendorAccountService, VendorAccountRepository, VendorAccountCipherUtilService],
    controllers: [VendorAccountController],
})
export class VendorAccountModule {}
