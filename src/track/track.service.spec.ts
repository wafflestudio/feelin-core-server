import { TrackScraperModule } from '@/track-scraper/track-scraper.module.js';
import { TypeOrmSQLITETestingModule } from '@utils/testUtils.js';
import { Test, TestingModule } from '@nestjs/testing';
import { TrackService } from './track.service.js';
import { VendorTrack } from './entity/vendorTrack.entity.js';

describe('TrackService', () => {
    let service: TrackService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [TrackScraperModule, ...TypeOrmSQLITETestingModule([VendorTrack])],
            providers: [TrackService],
        }).compile();

        service = module.get<TrackService>(TrackService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
