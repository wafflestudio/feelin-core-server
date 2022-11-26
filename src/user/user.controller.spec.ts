import { AuthModule } from '@/auth/auth.module.js';
import { AuthdataService } from '@/authdata/authdata.service.js';
import { Playlist } from '@/playlist/entity/playlist.entity.js';
import { VendorPlaylist } from '@/playlist/entity/vendorPlaylist.entity.js';
import { PlaylistModule } from '@/playlist/playlist.module.js';
import { UserScraperModule } from '@/user-scraper/user-scraper.module.js';
import { createTestingModule } from '@/utils/testUtils.js';
import { TestingModule } from '@nestjs/testing';
import { User } from './entity/user.entity.js';
import { UserController } from './user.controller.js';
import { UserModule } from './user.module.js';

describe('UserController', () => {
    let controller: UserController;

    beforeEach(async () => {
        const module: TestingModule = await createTestingModule({
            imports: [UserModule, PlaylistModule, UserScraperModule, AuthModule],
            providers: [AuthdataService],
            controllers: [UserController],
            entities: [Playlist, VendorPlaylist, User],
        });

        controller = module.get<UserController>(UserController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
