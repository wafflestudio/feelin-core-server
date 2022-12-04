import { TrackScraperModule } from '@/track-scraper/track-scraper.module.js';
import { createTestingModule } from '@/utils/test-utils.js';
import { TestingModule } from '@nestjs/testing';
import { TrackModule } from './track.module.js';
import { TrackService } from './track.service.js';

describe('TrackService', () => {
    let service: TrackService;

    beforeEach(async () => {
        const module: TestingModule = await createTestingModule({
            imports: [TrackScraperModule, TrackModule],
            providers: [],
        });

        service = module.get<TrackService>(TrackService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
