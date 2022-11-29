import { createTestingModule } from '@/utils/test-utils.js';
import { VendorAccount } from './entity/vendor-account.entity.js';
import { VendorAccountModule } from './vendor-account.module.js';
import { VendorAccountService } from './vendor-account.service.js';

describe('VendorAccountService', () => {
    let service: VendorAccountService;

    beforeEach(async () => {
        const module = await createTestingModule({
            imports: [VendorAccountModule],
            entities: [VendorAccount],
        });

        service = module.get<VendorAccountService>(VendorAccountService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
