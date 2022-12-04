import { AuthModule } from '@/auth/auth.module.js';
import { AuthdataService } from '@/authdata/authdata.service.js';
import { PlaylistModule } from '@/playlist/playlist.module.js';
import { UserScraperModule } from '@/user-scraper/user-scraper.module.js';
import { createTestingModule } from '@/utils/test-utils.js';
import { TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller.js';
import { UserModule } from './user.module.js';

describe('UserController', () => {
    let controller: UserController;

    beforeEach(async () => {
        const module: TestingModule = await createTestingModule({
            imports: [UserModule, PlaylistModule, UserScraperModule, AuthModule],
            providers: [AuthdataService],
            controllers: [UserController],
        });

        controller = module.get<UserController>(UserController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
