import { createTestingModule } from '@/utils/testUtils.js';
import { TestingModule } from '@nestjs/testing';
import { TrackScraperModule } from './track-scraper.module.js';
import { TrackScraperService } from './track-scraper.service.js';

describe('TrackScraperService', () => {
    let service: TrackScraperService;

    beforeEach(async () => {
        const module: TestingModule = await createTestingModule({
            imports: [TrackScraperModule],
        });

        service = module.get<TrackScraperService>(TrackScraperService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
