import { AuthModule } from '@/auth/auth.module.js';
import { AuthdataService } from '@/authdata/authdata.service.js';
import { PlaylistModule } from '@/playlist/playlist.module.js';
import { UserScraperModule } from '@/user-scraper/user-scraper.module.js';
import { CipherUtilService } from '@/utils/cipher-util/cipher-util.service.js';
import { VendorAccount } from '@/vendor-account/entity/vendor-account.entity.js';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity.js';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';

@Module({
    imports: [
        forwardRef(() => PlaylistModule),
        forwardRef(() => AuthModule),
        UserScraperModule,
        TypeOrmModule.forFeature([User, VendorAccount]),
    ],
    controllers: [UserController],
    providers: [UserService, AuthdataService, CipherUtilService],
    exports: [UserService],
})
export class UserModule {}
