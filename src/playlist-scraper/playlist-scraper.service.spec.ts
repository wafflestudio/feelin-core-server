import { createTestingModule } from '@/utils/test-utils.js';
import { TestingModule } from '@nestjs/testing';
import { PlaylistScraperModule } from './playlist-scraper.module.js';
import { PlaylistScraperService } from './playlist-scraper.service.js';

describe('PlaylistScraperService', () => {
    let service: PlaylistScraperService;

    beforeEach(async () => {
        const module: TestingModule = await createTestingModule({
            imports: [PlaylistScraperModule],
        });

        service = module.get<PlaylistScraperService>(PlaylistScraperService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
