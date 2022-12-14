import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { EncryptionResult } from './types.js';

@Injectable()
export class CipherUtilService {
    private readonly algorithm = 'aes-256-cbc';
    private readonly ivLength = 16;
    private readonly inputEncoding = 'utf8';

    encrypt(text: string): EncryptionResult {
        const key = randomBytes(32);
        const iv = randomBytes(this.ivLength);

        const cipher = createCipheriv(this.algorithm, key, iv);
        const ciphered = Buffer.concat([cipher.update(text, this.inputEncoding), cipher.final()]).toString('hex');
        const encryptedData = iv.toString('hex') + ':' + ciphered;

        return { key, encryptedData };
    }

    encryptWithKey(text: string, key: Buffer): string {
        const iv = randomBytes(this.ivLength);

        const cipher = createCipheriv(this.algorithm, key, iv);
        const ciphered = Buffer.concat([cipher.update(text, this.inputEncoding), cipher.final()]).toString('hex');
        const encryptedData = iv.toString('hex') + ':' + ciphered;

        return encryptedData;
    }

    decrypt(text: string, key: Buffer): string {
        const [iv, ciphered] = text.split(':');
        const decipher = createDecipheriv(this.algorithm, key, Buffer.from(iv, 'hex'));
        const deciphered = Buffer.concat([decipher.update(Buffer.from(ciphered, 'hex')), decipher.final()]);

        return deciphered.toString();
    }
}
