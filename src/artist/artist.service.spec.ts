import { createTestingModule } from '@/utils/test-utils.js';
import { TestingModule } from '@nestjs/testing';
import { ArtistService } from './artist.service.js';

describe('ArtistService', () => {
    let service: ArtistService;

    beforeEach(async () => {
        const module: TestingModule = await createTestingModule({
            providers: [ArtistService],
        });

        service = module.get<ArtistService>(ArtistService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
