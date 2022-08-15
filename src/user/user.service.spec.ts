import { AuthdataService } from '@/authdata/authdata.service.js';
import { TrackModule } from '@/track/track.module.js';
import { UserScraperModule } from '@/user-scraper/user-scraper.module.js';
import { TypeOrmSQLITETestingModule } from '@/utils/testUtils.js';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from './user.entity.js';
import { UserService } from './user.service.js';

describe('UserService', () => {
    let service: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                UserScraperModule,
                TrackModule,
                ...TypeOrmSQLITETestingModule([User]),
            ],
            providers: [AuthdataService, UserService],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
