import { AuthdataService } from '@/authdata/authdata.service.js';
import { TrackModule } from '@/track/track.module.js';
import { UserScraperModule } from '@/user-scraper/user-scraper.module.js';
import { CipherUtilService } from '@/utils/cipher-util/cipher-util.service.js';
import { createTestingModule } from '@/utils/testUtils.js';
import { VendorAccount } from '@/vendor-account/entity/vendor-account.entity.js';
import { TestingModule } from '@nestjs/testing';
import { User } from './entity/user.entity.js';
import { UserService } from './user.service.js';

describe('UserService', () => {
    let service: UserService;

    beforeEach(async () => {
        const module: TestingModule = await createTestingModule({
            imports: [UserScraperModule, TrackModule],
            providers: [AuthdataService, UserService, CipherUtilService],
            entities: [User, VendorAccount],
        });

        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
