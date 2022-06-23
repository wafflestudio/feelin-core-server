import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistScraperService } from './playlist-scraper.service';

describe('PlaylistScraperService', () => {
    let service: PlaylistScraperService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PlaylistScraperService],
        }).compile();

        service = module.get<PlaylistScraperService>(PlaylistScraperService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
