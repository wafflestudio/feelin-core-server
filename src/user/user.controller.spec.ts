import { AuthdataService } from '@/authdata/authdata.service.js';
import { PlaylistModule } from '@/playlist/playlist.module.js';
import { UserScraperModule } from '@/user-scraper/user-scraper.module.js';
import { TypeOrmSQLITETestingModule } from '@/utils/testUtils.js';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller.js';
import { User } from './entity/user.entity.js';
import { UserModule } from './user.module.js';
import { VendorPlaylist } from '@/playlist/entity/vendorPlaylist.entity.js';
import { Playlist } from '@/playlist/entity/playlist.entity.js';

describe('UserController', () => {
    let controller: UserController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                UserModule,
                PlaylistModule,
                UserScraperModule,
                ...TypeOrmSQLITETestingModule([Playlist, VendorPlaylist, User]),
            ],
            providers: [AuthdataService],
            controllers: [UserController],
        }).compile();

        controller = module.get<UserController>(UserController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
