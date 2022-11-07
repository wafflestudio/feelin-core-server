import { User } from '@/user/entity/user.entity.js';
import { UserModule } from '@/user/user.module.js';
import { CipherUtilService } from '@/utils/cipher-util/cipher-util.service.js';
import { VendorAccountModule } from '@/vendor-account/vendor-account.module.js';
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service.js';

@Module({
    imports: [
        forwardRef(() => VendorAccountModule),
        forwardRef(() => UserModule),
        JwtModule.register({}),
        TypeOrmModule.forFeature([User]),
    ],
    controllers: [],
    providers: [AuthService, CipherUtilService],
    exports: [AuthService],
})
export class AuthModule {}
