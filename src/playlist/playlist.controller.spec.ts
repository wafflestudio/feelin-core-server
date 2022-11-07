import { User } from '@/user/entity/user.entity.js';
import { VendorAccount } from '@/vendor-account/entity/vendor-account.entity.js';
import { TypeOrmSQLITETestingModule } from '@/utils/testUtils.js';
import { Test, TestingModule } from '@nestjs/testing';
import { Playlist } from './entity/playlist.entity.js';
import { VendorPlaylist } from './entity/vendorPlaylist.entity.js';
import { PlaylistController } from './playlist.controller.js';
import { PlaylistModule } from './playlist.module.js';

describe('PlaylistController', () => {
    let controller: PlaylistController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PlaylistModule, ...TypeOrmSQLITETestingModule([Playlist, VendorPlaylist, User, VendorAccount])],
            controllers: [PlaylistController],
        }).compile();

        controller = module.get<PlaylistController>(PlaylistController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
