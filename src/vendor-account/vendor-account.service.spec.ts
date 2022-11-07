import { Test, TestingModule } from '@nestjs/testing';
import { VendorAccountService } from './vendor-account.service';

describe('VendorAccountService', () => {
    let service: VendorAccountService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [VendorAccountService],
        }).compile();

        service = module.get<VendorAccountService>(VendorAccountService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
