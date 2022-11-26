import { User } from '@/user/entity/user.entity.js';
import { createTestingModule } from '@/utils/testUtils.js';
import { VendorAccount } from '@/vendor-account/entity/vendor-account.entity.js';
import { TestingModule } from '@nestjs/testing';
import { Playlist } from './entity/playlist.entity.js';
import { VendorPlaylist } from './entity/vendorPlaylist.entity.js';
import { PlaylistController } from './playlist.controller.js';
import { PlaylistModule } from './playlist.module.js';

describe('PlaylistController', () => {
    let controller: PlaylistController;

    beforeEach(async () => {
        const module: TestingModule = await createTestingModule({
            imports: [PlaylistModule],
            controllers: [PlaylistController],
            entities: [Playlist, VendorPlaylist, User, VendorAccount],
        });

        controller = module.get<PlaylistController>(PlaylistController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
