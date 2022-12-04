import { AuthdataService } from '@/authdata/authdata.service.js';
import { TrackModule } from '@/track/track.module.js';
import { UserScraperModule } from '@/user-scraper/user-scraper.module.js';
import { CipherUtilService } from '@/utils/cipher-util/cipher-util.service.js';
import { createTestingModule } from '@/utils/test-utils.js';
import { TestingModule } from '@nestjs/testing';
import { UserModule } from './user.module.js';
import { UserService } from './user.service.js';

describe('UserService', () => {
    let service: UserService;

    beforeEach(async () => {
        const module: TestingModule = await createTestingModule({
            imports: [UserScraperModule, TrackModule, UserModule],
            providers: [AuthdataService, CipherUtilService],
        });

        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
