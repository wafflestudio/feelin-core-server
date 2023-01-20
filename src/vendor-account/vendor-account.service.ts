import { Vendors } from '@/types/types.js';
import { CipherUtilService } from '@/utils/cipher-util/cipher-util.service.js';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import axios from 'axios';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import { v4 as uuidv4 } from 'uuid';
import { VendorAccountLoginDto } from './dto/vendor-account-login.dto.js';
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
        dayjs.extend(duration);
        this.expiresIn = {
            melon: 0,
            flo: 0,
            spotify: 0,
            applemusic: dayjs.duration(6, 'months').asSeconds(),
        };
    }

    private readonly encryptKey: Buffer;
    private readonly loginUrls: Record<Vendors, string> = {
        melon: '',
        flo: '',
        spotify: 'https://accounts.spotify.com/authorize',
        applemusic: 'http://ec2-52-78-109-189.ap-northeast-2.compute.amazonaws.com/apple-music-login.html',
    };
    private readonly expiresIn: Record<Vendors, number>;

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
                    '?' +
                    new URLSearchParams({
                        client_id: this.configService.getOrThrow('SPOTIFY_CLIENT_ID'),
                        response_type: 'code',
                        redirect_uri: this.configService.getOrThrow('SPOTIFY_REDIRECT_URI'),
                        scope: this.configService.getOrThrow('SPOTIFY_SCOPES'),
                        state: vendorAccount.id,
                    }).toString()
                );
            case 'applemusic':
                return loginUrl + '?' + new URLSearchParams({ id: vendorAccount.id }).toString();
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

    async handleVendorAccountLogin(request: VendorAccountLoginDto, vendor: Vendors, user: User) {
        const { id, accessToken, refreshToken } = request;
        const vendorAccount = await this.vendorAccountRepository.findById(id);
        if (!vendorAccount) {
            throw new NotFoundException('Vendor account does not exist');
        }
        if (vendorAccount.userId !== user.id) {
            throw new ForbiddenException('Vendor account does not belong to user');
        }

        return await this.vendorAccountRepository.update({
            where: { id },
            data: {
                accessToken: this.cipherUtilService.encryptWithKey(accessToken, this.encryptKey),
                refreshToken: refreshToken === null ? null : this.cipherUtilService.encryptWithKey(refreshToken, this.encryptKey),
                expiresAt: dayjs().add(this.expiresIn[vendor], 'second').toDate(),
            },
        });
    }
}
