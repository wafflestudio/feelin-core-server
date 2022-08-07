import { AuthdataService } from '@authdata/authdata.service.js';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistModule } from '@playlist/playlist.module.js';
import { UserScraperModule } from '@user-scraper/user-scraper.module.js';
import { UserScraperService } from '@user-scraper/user-scraper.service.js';
import { UserController } from './user.controller.js';
import { User } from './user.entity.js';
import { UserService } from './user.service.js';

@Module({
    imports: [
        forwardRef(() => PlaylistModule),
        UserScraperModule,
        TypeOrmModule.forFeature([User]),
    ],
    controllers: [UserController],
    providers: [UserService, AuthdataService],
    exports: [TypeOrmModule],
})
export class UserModule {}
