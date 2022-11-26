import { UserModule } from '@/user/user.module.js';
import { CipherUtilService } from '@/utils/cipher-util/cipher-util.service.js';
import { createTestingModule } from '@/utils/testUtils.js';
import { VendorAccountModule } from '@/vendor-account/vendor-account.module.js';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TestingModule } from '@nestjs/testing';
import { AuthModule } from './auth.module.js';
import { AuthService } from './auth.service.js';

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await createTestingModule({
            imports: [AuthModule, VendorAccountModule, UserModule, JwtModule.register({})],
            providers: [AuthService, JwtService, CipherUtilService],
        });

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
