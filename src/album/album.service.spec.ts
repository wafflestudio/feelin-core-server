import { createTestingModule } from '@/utils/testUtils.js';
import { TestingModule } from '@nestjs/testing';
import { AlbumService } from './album.service.js';

describe('AlbumService', () => {
    let service: AlbumService;

    beforeEach(async () => {
        const module: TestingModule = await createTestingModule({
            providers: [AlbumService],
        });

        service = module.get<AlbumService>(AlbumService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
