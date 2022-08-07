import { Test, TestingModule } from '@nestjs/testing';
import { MeService } from './me.service.js';

describe('MeService', () => {
    let service: MeService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MeService],
        }).compile();

        service = module.get<MeService>(MeService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
