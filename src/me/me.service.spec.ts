import { createTestingModule } from '@/utils/test-utils.js';
import { TestingModule } from '@nestjs/testing';
import { MeService } from './me.service.js';

describe('MeService', () => {
    let service: MeService;

    beforeEach(async () => {
        const module: TestingModule = await createTestingModule({
            providers: [MeService],
        });

        service = module.get<MeService>(MeService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
