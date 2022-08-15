import { Test, TestingModule } from '@nestjs/testing';
import { TrackScraperModule } from './track-scraper.module.js';
import TrackScraperService from './track-scraper.service.js';

describe('TrackScraperService', () => {
    let service: TrackScraperService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [TrackScraperModule],
        }).compile();

        service = module.get<TrackScraperService>(TrackScraperService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
