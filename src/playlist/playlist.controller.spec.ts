import { AuthModule } from '@/auth/auth.module.js';
import { createTestingModule } from '@/utils/test-utils.js';
import { TestingModule } from '@nestjs/testing';
import { PlaylistController } from './playlist.controller.js';
import { PlaylistModule } from './playlist.module.js';

describe('PlaylistController', () => {
    let controller: PlaylistController;

    beforeEach(async () => {
        const module: TestingModule = await createTestingModule({
            imports: [PlaylistModule, AuthModule],
            controllers: [PlaylistController],
        });

        controller = module.get<PlaylistController>(PlaylistController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
