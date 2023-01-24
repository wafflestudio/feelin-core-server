import { CipherUtilService } from '@/utils/cipher-util/cipher-util.service.js';
import { Authdata } from '@/vendor-account/dto/decrypted-vendor-account.dto.js';
import { VendorAccountRepository } from '@/vendor-account/vendor-account.repository.js';
import { VendorAccountService } from '@/vendor-account/vendor-account.service.js';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VendorAccount } from '@prisma/client';
import dayjs from 'dayjs';
import { readFileSync } from 'fs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { TOKEN_ADMIN_USER_ID, UserScraper } from './user-scraper.js';

@Injectable()
export class ApplemusicUserScraper implements UserScraper {
    constructor(
        private readonly vendorAccountService: VendorAccountService,
        private readonly vendorAccountRepository: VendorAccountRepository,
        private readonly cipherUtilService: CipherUtilService,
        private readonly configService: ConfigService,
    ) {
        this.encryptKey = Buffer.from(this.configService.getOrThrow<string>('ENCRYPT_KEY'), 'hex');
        this.privateKey = readFileSync('AuthKey.p8', 'utf8');
    }

    private readonly encryptKey: Buffer;
    private readonly privateKey: string;
    private readonly algorithm = 'ES256';
    private readonly expiresIn = 90;

    async decryptAndRefreshToken(vendorAccount: VendorAccount): Promise<Authdata> {
        if (dayjs().add(5, 'minutes').isBefore(dayjs(vendorAccount.expiresAt))) {
            return this.vendorAccountService.decryptVendorAccount(vendorAccount);
        }
        throw new BadRequestException('Refresh is not supported for Apple Music');
    }

    async getAdminToken(): Promise<string> {
        const vendorAccount = await this.vendorAccountRepository.findByUserIdAndVendor(TOKEN_ADMIN_USER_ID, 'applemusic');
        if (vendorAccount && dayjs().isBefore(dayjs(vendorAccount.expiresAt))) {
            return this.cipherUtilService.decrypt(vendorAccount.accessToken, this.encryptKey);
        }

        const { accessToken, expiresAt } = await this.createAdminToken();
        if (vendorAccount) {
            await this.vendorAccountRepository.update({
                where: { id: vendorAccount.id },
                data: {
                    accessToken: this.cipherUtilService.encryptWithKey(accessToken, this.encryptKey),
                    expiresAt: expiresAt.toDate(),
                },
            });
        } else {
            await this.vendorAccountRepository.create({
                id: uuidv4(),
                user: { connect: { id: TOKEN_ADMIN_USER_ID } },
                vendor: 'applemusic',
                accessToken: this.cipherUtilService.encryptWithKey(accessToken, this.encryptKey),
                expiresAt: expiresAt.toDate(),
            });
        }

        return accessToken;
    }

    async createAdminToken(): Promise<{ accessToken: string; expiresAt: dayjs.Dayjs }> {
        const headers = {
            alg: this.algorithm,
            kid: this.configService.getOrThrow('APPLE_AUTHKEY_KEY_ID'),
        };

        const now = dayjs();
        const expiresAt = now.add(this.expiresIn, 'days');
        const payload = {
            iss: this.configService.getOrThrow('APPLE_TEAM_ID'),
            exp: expiresAt.unix(),
            iat: now.unix(),
        };

        const token = jwt.sign(payload, this.privateKey, { header: headers });

        return { accessToken: token, expiresAt: expiresAt };
    }
}
