import { TypeOrmSQLITETestingModule } from '@/utils/testUtils.js';
import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistScraperModule } from './playlist-scraper.module.js';
import { PlaylistScraperService } from './playlist-scraper.service.js';

describe('PlaylistScraperService', () => {
    let service: PlaylistScraperService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PlaylistScraperModule, ...TypeOrmSQLITETestingModule([])],
        }).compile();

        service = module.get<PlaylistScraperService>(PlaylistScraperService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
