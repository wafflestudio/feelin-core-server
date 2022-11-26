import { createTestingModule } from '@/utils/testUtils.js';
import { TestingModule } from '@nestjs/testing';
import { AuthdataService } from './authdata.service.js';

describe('AuthdataService', () => {
    let service: AuthdataService;

    beforeEach(async () => {
        const module: TestingModule = await createTestingModule({
            providers: [AuthdataService],
        });

        service = module.get<AuthdataService>(AuthdataService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
