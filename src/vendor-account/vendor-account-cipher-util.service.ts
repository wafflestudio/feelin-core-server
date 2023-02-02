import { CipherUtilService } from '@/utils/cipher-util/cipher-util.service.js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VendorAccount } from '@prisma/client';
import { Authdata } from './dto/decrypted-vendor-account.dto.js';

@Injectable()
export class VendorAccountCipherUtilService {
    constructor(private readonly cipherUtilService: CipherUtilService, private readonly configService: ConfigService) {
        this.encryptKey = Buffer.from(this.configService.getOrThrow<string>('ENCRYPT_KEY'), 'hex');
    }

    private readonly encryptKey: Buffer;

    decryptVendorAccount(vendorAccount: VendorAccount): Authdata {
        if (vendorAccount === null) {
            return null;
        }
        const accessToken = this.cipherUtilService.decrypt(vendorAccount.accessToken, this.encryptKey);
        const refreshToken =
            vendorAccount.refreshToken === null
                ? null
                : this.cipherUtilService.decrypt(vendorAccount.refreshToken, this.encryptKey);
        const adminToken =
            vendorAccount.adminToken === null ? null : this.cipherUtilService.decrypt(vendorAccount.adminToken, this.encryptKey);
        return { accessToken, refreshToken, adminToken };
    }
}
