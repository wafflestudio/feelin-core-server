import { TrackScraperModule } from '@/track-scraper/track-scraper.module.js';
import { TypeOrmSQLITETestingModule } from '@utils/testUtils.js';
import { Test, TestingModule } from '@nestjs/testing';
import { StreamTrack } from './streamTrack.entity.js';
import { TrackService } from './track.service.js';

describe('TrackService', () => {
    let service: TrackService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [TrackScraperModule, ...TypeOrmSQLITETestingModule([StreamTrack])],
            providers: [TrackService],
        }).compile();

        service = module.get<TrackService>(TrackService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
