import { AuthModule } from '@/auth/auth.module.js';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorAccount } from './entity/vendor-account.entity.js';
import { VendorAccountService } from './vendor-account.service.js';
import { VendorAuthGuard } from './vendor-auth.guard.js';

@Module({
    imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([VendorAccount])],
    providers: [VendorAccountService, VendorAuthGuard],
    exports: [VendorAccountService],
})
export class VendorAccountModule {}
