import { CipherUtilService } from '@/utils/cipher-util/cipher-util.service.js';
import { Authdata } from '@/vendor-account/dto/decrypted-vendor-account.dto.js';
import { VendorAccountRepository } from '@/vendor-account/vendor-account.repository.js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VendorAccount } from '@prisma/client';
import axios from 'axios';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { TOKEN_ADMIN_USER_ID, UserScraper } from './user-scraper.js';

@Injectable()
export class SpotifyUserScraper implements UserScraper {
    constructor(
        private readonly vendorAccountRepository: VendorAccountRepository,
        private readonly cipherUtilService: CipherUtilService,
        private readonly configService: ConfigService,
    ) {
        this.encryptKey = Buffer.from(this.configService.getOrThrow<string>('ENCRYPT_KEY'), 'hex');
    }

    private readonly encryptKey: Buffer;

    async refresh(vendorAccount: VendorAccount): Promise<Authdata> {
        const refreshToken = this.cipherUtilService.decrypt(vendorAccount.refreshToken, this.encryptKey);
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            }).toString(),
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(
                        `${this.configService.getOrThrow('SPOTIFY_CLIENT_ID')}:${this.configService.getOrThrow(
                            'SPOTIFY_CLIENT_SECRET',
                        )}`,
                    ).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            },
        );
        await this.vendorAccountRepository.update({
            where: { id: vendorAccount.id },
            data: {
                accessToken: this.cipherUtilService.encryptWithKey(response.data.access_token, this.encryptKey),
                expiresAt: dayjs().add(response.data.expires_in, 'second').toDate(),
            },
        });

        return {
            accessToken: response.data.access_token,
            refreshToken: refreshToken,
        };
    }

    async getAdminToken(): Promise<string> {
        const vendorAccount = await this.vendorAccountRepository.findByUserIdAndVendor(TOKEN_ADMIN_USER_ID, 'spotify');
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
                vendor: 'spotify',
                accessToken: this.cipherUtilService.encryptWithKey(accessToken, this.encryptKey),
                expiresAt: expiresAt.toDate(),
            });
        }

        return accessToken;
    }

    async createAdminToken(): Promise<{ accessToken: string; expiresAt: dayjs.Dayjs }> {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({
                grant_type: 'client_credentials',
            }).toString(),
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(
                        `${this.configService.getOrThrow('SPOTIFY_CLIENT_ID')}:${this.configService.getOrThrow(
                            'SPOTIFY_CLIENT_SECRET',
                        )}`,
                    ).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            },
        );
        return { accessToken: response.data.access_token, expiresAt: dayjs().add(response.data.expires_in, 'second') };
    }
}
