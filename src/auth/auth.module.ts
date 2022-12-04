import { UserModule } from '@/user/user.module.js';
import { CipherUtilService } from '@/utils/cipher-util/cipher-util.service.js';
import { VendorAccountModule } from '@/vendor-account/vendor-account.module.js';
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';

@Module({
    imports: [forwardRef(() => VendorAccountModule), forwardRef(() => UserModule), JwtModule.register({})],
    controllers: [],
    providers: [AuthService, CipherUtilService, JwtAuthGuard],
    exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
