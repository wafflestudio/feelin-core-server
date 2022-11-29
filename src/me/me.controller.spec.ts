import { createTestingModule } from '@/utils/test-utils.js';
import { TestingModule } from '@nestjs/testing';
import { MeController } from './me.controller.js';

describe('MeController', () => {
    let controller: MeController;

    beforeEach(async () => {
        const module: TestingModule = await createTestingModule({
            controllers: [MeController],
        });

        controller = module.get<MeController>(MeController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
