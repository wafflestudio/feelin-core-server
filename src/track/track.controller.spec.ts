import { createTestingModule } from '@/utils/testUtils.js';
import { TestingModule } from '@nestjs/testing';
import { TrackController } from './track.controller.js';

describe('TrackController', () => {
    let controller: TrackController;

    beforeEach(async () => {
        const module: TestingModule = await createTestingModule({
            controllers: [TrackController],
        });

        controller = module.get<TrackController>(TrackController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
