import { Test, TestingModule } from '@nestjs/testing';
import { SimilarityUtilService } from './similarity-util.service';

describe('SimilarityUtilService', () => {
    let service: SimilarityUtilService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SimilarityUtilService],
        }).compile();

        service = module.get<SimilarityUtilService>(SimilarityUtilService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
