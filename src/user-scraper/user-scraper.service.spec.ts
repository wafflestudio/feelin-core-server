import { createTestingModule } from '@/utils/test-utils.js';
import { TestingModule } from '@nestjs/testing';
import { UserScraperModule } from './user-scraper.module.js';
import { UserScraperService } from './user-scraper.service.js';

describe('UserScraperService', () => {
    let service: UserScraperService;

    beforeEach(async () => {
        const module: TestingModule = await createTestingModule({
            imports: [UserScraperModule],
        });

        service = module.get<UserScraperService>(UserScraperService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
