import { AuthModule } from '@/auth/auth.module.js';
import { PrismaService } from '@/prisma.service.js';
import { VendorAccountRepository } from '@/user/vendor-account.repository.js';
import { forwardRef, Module } from '@nestjs/common';
import { VendorAccountService } from './vendor-account.service.js';
import { VendorAuthGuard } from './vendor-auth.guard.js';

@Module({
    imports: [forwardRef(() => AuthModule)],
    providers: [VendorAccountService, VendorAuthGuard, PrismaService, VendorAccountRepository],
    exports: [VendorAccountService, VendorAccountRepository],
})
export class VendorAccountModule {}
