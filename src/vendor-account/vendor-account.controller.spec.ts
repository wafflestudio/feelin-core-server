import { Test, TestingModule } from '@nestjs/testing';
import { VendorAccountController } from './vendor-account.controller';

describe('VendorAccountController', () => {
    let controller: VendorAccountController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [VendorAccountController],
        }).compile();

        controller = module.get<VendorAccountController>(VendorAccountController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
