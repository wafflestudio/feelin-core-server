import { Test, TestingModule } from '@nestjs/testing';
import { PromiseUtil } from './promise-util.service';

describe('PromiseUtilService', () => {
    let service: PromiseUtil;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PromiseUtil],
        }).compile();

        service = module.get<PromiseUtil>(PromiseUtil);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
