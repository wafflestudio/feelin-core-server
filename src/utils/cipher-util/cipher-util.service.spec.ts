import { Test, TestingModule } from '@nestjs/testing';
import { CipherUtilService } from './cipher-util.service';

describe('CipherUtilService', () => {
    let service: CipherUtilService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CipherUtilService],
        }).compile();

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
