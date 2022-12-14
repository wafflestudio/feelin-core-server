import { TestingModule } from '@nestjs/testing';
import { createTestingModule } from '../test-utils';
import { CipherUtilService } from './cipher-util.service.js';

describe('CipherUtilService', () => {
    let service: CipherUtilService;

    beforeEach(async () => {
        const module: TestingModule = await createTestingModule({
            providers: [CipherUtilService],
        });

        service = module.get<CipherUtilService>(CipherUtilService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should encrypt and decrypt', () => {
        const text = 'Hello World';
        const { key, encryptedData } = service.encrypt(text);

        const decryptedData = service.decrypt(encryptedData, key);

        expect(decryptedData).toBe(text);
    });
});
