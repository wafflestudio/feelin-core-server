import { Test, TestingModule } from '@nestjs/testing';
import { TrackMatcherService } from './track-matcher.service';

describe('TrackMatcherService', () => {
    let service: TrackMatcherService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TrackMatcherService],
        }).compile();

        service = module.get<TrackMatcherService>(TrackMatcherService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
