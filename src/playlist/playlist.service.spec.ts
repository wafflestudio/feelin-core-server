import { AuthdataService } from '@/authdata/authdata.service.js';
import { TrackModule } from '@/track/track.module.js';
import { UserModule } from '@/user/user.module.js';
import { createTestingModule } from '@/utils/test-utils.js';
import { TestingModule } from '@nestjs/testing';
import { PlaylistModule } from './playlist.module.js';
import { PlaylistService } from './playlist.service.js';

describe('PlaylistService', () => {
    let service: PlaylistService;

    beforeEach(async () => {
        const module: TestingModule = await createTestingModule({
            imports: [PlaylistModule, TrackModule, UserModule],
            providers: [AuthdataService],
        });

        service = module.get<PlaylistService>(PlaylistService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
