import { Test, TestingModule } from '@nestjs/testing';
import { AuthdataService } from './authdata.service';

describe('AuthdataService', () => {
    let service: AuthdataService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthdataService],
        }).compile();

        service = module.get<AuthdataService>(AuthdataService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
