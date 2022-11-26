import { createTestingModule } from '@/utils/testUtils.js';
import { TestingModule } from '@nestjs/testing';
import { AlbumController } from './album.controller.js';

describe('AlbumController', () => {
    let controller: AlbumController;

    beforeEach(async () => {
        const module: TestingModule = await createTestingModule({
            controllers: [AlbumController],
        });

        controller = module.get<AlbumController>(AlbumController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
