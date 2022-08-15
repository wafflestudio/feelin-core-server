import { StreamAccount, User } from '@/user/user.entity.js';
import { TypeOrmSQLITETestingModule } from '@/utils/testUtils.js';
import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistController } from './playlist.controller.js';
import Playlist from './playlist.entity.js';
import { PlaylistModule } from './playlist.module.js';
import StreamPlaylist from './streamPlaylist.entity.js';

describe('PlaylistController', () => {
    let controller: PlaylistController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                PlaylistModule,
                ...TypeOrmSQLITETestingModule([
                    Playlist,
                    StreamPlaylist,
                    StreamAccount,
                    User,
                ]),
            ],
            controllers: [PlaylistController],
        }).compile();

        controller = module.get<PlaylistController>(PlaylistController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
