import { createTestingModule } from '@/utils/testUtils.js';
import { TestingModule } from '@nestjs/testing';
import { ArtistController } from './artist.controller.js';

describe('ArtistController', () => {
    let controller: ArtistController;

    beforeEach(async () => {
        const module: TestingModule = await createTestingModule({
            controllers: [ArtistController],
        });

        controller = module.get<ArtistController>(ArtistController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
