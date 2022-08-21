import { AuthdataService } from '@/authdata/authdata.service.js';
import { Playlist } from '@/playlist/playlist.entity.js';
import { PlaylistModule } from '@/playlist/playlist.module.js';
import { StreamPlaylist } from '@/playlist/streamPlaylist.entity.js';
import { UserScraperModule } from '@/user-scraper/user-scraper.module.js';
import { TypeOrmSQLITETestingModule } from '@/utils/testUtils.js';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller.js';
import { StreamAccount, User } from './user.entity.js';
import { UserModule } from './user.module.js';

describe('UserController', () => {
    let controller: UserController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                UserModule,
                PlaylistModule,
                UserScraperModule,
                ...TypeOrmSQLITETestingModule([Playlist, StreamPlaylist, StreamAccount, User]),
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
