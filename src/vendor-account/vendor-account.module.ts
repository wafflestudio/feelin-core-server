import { AuthModule } from '@/auth/auth.module.js';
import { PrismaService } from '@/prisma.service.js';
import { VendorAccountRepository } from '@/user/vendor-account.repository.js';
import { Module, forwardRef } from '@nestjs/common';
import { VendorAccountController } from './vendor-account.controller.js';
import { VendorAccountService } from './vendor-account.service.js';
import { VendorAuthGuard } from './vendor-auth.guard.js';

@Module({
    imports: [forwardRef(() => AuthModule)],
    providers: [VendorAccountService, VendorAuthGuard, PrismaService, VendorAccountRepository],
    exports: [VendorAccountService, VendorAccountRepository],
    controllers: [VendorAccountController],
})
export class VendorAccountModule {}
