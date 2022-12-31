import { Vendors } from '@/types/types.js';
import { CipherUtilService } from '@/utils/cipher-util/cipher-util.service.js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import axios from 'axios';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { SpotifyTokenResponse } from './types.js';
import { VendorAccountRepository } from './vendor-account.repository.js';

@Injectable()
export class VendorAccountService {
    constructor(
        private readonly vendorAccountRepository: VendorAccountRepository,
        private readonly cipherUtilService: CipherUtilService,
        private readonly configService: ConfigService,
    ) {
        this.encryptKey = Buffer.from(this.configService.getOrThrow<string>('ENCRYPT_KEY'), 'hex');
    }

    private readonly encryptKey: Buffer;
    private readonly loginUrls: Record<Vendors, string> = {
        melon: '',
        flo: '',
        spotify: 'https://accounts.spotify.com/authorize?',
    };

    async getLoginUrl(user: User, vendor: Vendors) {
        const loginUrl = this.loginUrls[vendor];
        const vendorAccount = await this.vendorAccountRepository.create({
            id: uuidv4(),
            vendor,
            user: { connect: { id: user.id } },
        });

        switch (vendor) {
            case 'melon':
                break;
            case 'flo':
                break;
            case 'spotify':
                return (
                    loginUrl +
                    new URLSearchParams({
                        client_id: this.configService.getOrThrow('SPOTIFY_CLIENT_ID'),
                        response_type: 'code',
                        redirect_uri: this.configService.getOrThrow('SPOTIFY_REDIRECT_URI'),
                        scope: this.configService.getOrThrow('SPOTIFY_SCOPES'),
                        state: vendorAccount.id,
                    }).toString()
                );
            default:
                break;
        }
    }

    async handleSpotifyLogin(code: string, state: string) {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: this.configService.getOrThrow('SPOTIFY_REDIRECT_URI'),
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

        const data: SpotifyTokenResponse = response.data;
        return await this.vendorAccountRepository.update({
            where: { id: state },
            data: {
                accessToken: this.cipherUtilService.encryptWithKey(data.access_token, this.encryptKey),
                refreshToken: this.cipherUtilService.encryptWithKey(data.refresh_token, this.encryptKey),
                expiresAt: dayjs().add(data.expires_in, 'second').toDate(),
            },
        });
    }
}
