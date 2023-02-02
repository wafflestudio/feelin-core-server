import { Vendors } from '@/types/types.js';
import { UserScraperService } from '@/user-scraper/user-scraper.service.js';
import { CipherUtilService } from '@/utils/cipher-util/cipher-util.service.js';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import axios from 'axios';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import { v4 as uuidv4 } from 'uuid';
import { VendorAccountLoginDto } from './dto/vendor-account-login.dto.js';
import { VendorAccountDto } from './dto/vendor-account.dto.js';
import { SpotifyTokenResponse } from './types.js';
import { VendorAccountRepository } from './vendor-account.repository.js';

@Injectable()
export class VendorAccountService {
    constructor(
        private readonly userScraperService: UserScraperService,
        private readonly vendorAccountRepository: VendorAccountRepository,
        private readonly cipherUtilService: CipherUtilService,
        private readonly configService: ConfigService,
    ) {
        dayjs.extend(duration);

        this.encryptKey = Buffer.from(this.configService.getOrThrow<string>('ENCRYPT_KEY'), 'hex');
        this.loginUrls = {
            melon: '',
            flo: '',
            spotify: configService.getOrThrow('SPOTIFY_LOGIN_URL'),
            applemusic: configService.getOrThrow('APPLEMUSIC_LOGIN_URL'),
        };
        this.expiresIn = {
            melon: 0,
            flo: 0,
            spotify: 0,
            applemusic: dayjs.duration(6, 'months').asSeconds(),
        };
    }

    private readonly encryptKey: Buffer;
    private readonly loginUrls: Record<Vendors, string>;
    private readonly expiresIn: Record<Vendors, number>;

    async getLoginUrl(user: User, vendor: Vendors) {
        const vendorAccounts = await this.getVendorAccounts(user);
        if (vendorAccounts.length > 0) {
            throw new BadRequestException('user can only have up to one account');
        }

        const loginUrl = this.loginUrls[vendor];
        const adminToken = vendor === 'applemusic' ? await this.userScraperService.get(vendor).getAdminToken() : null;
        const vendorAccount = await this.vendorAccountRepository.create({
            id: uuidv4(),
            vendor,
            user: { connect: { id: user.id } },
            adminToken: adminToken === null ? null : this.cipherUtilService.encryptWithKey(adminToken, this.encryptKey),
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
                return loginUrl + '?' + new URLSearchParams({ id: vendorAccount.id, token: adminToken }).toString();
            default:
                break;
        }
    }

    async getVendorAccounts(user: User): Promise<VendorAccountDto[]> {
        const vendorAccounts = await this.vendorAccountRepository.findLinkedByUserId(user.id);
        return vendorAccounts.map(({ id, vendor }) => new VendorAccountDto(id, vendor as Vendors));
    }

    async unlinkVendorAccount(user: User, vendorAccountId: string): Promise<void> {
        const vendorAccount = await this.vendorAccountRepository.findById(vendorAccountId).catch(() => {
            throw new NotFoundException('Not Found', 'vendor account not found');
        });
        if (vendorAccount.userId !== user.id) {
            throw new UnauthorizedException('Unauthorized', 'vendor account does not belong to user');
        }

        await this.vendorAccountRepository.update({
            where: { id: vendorAccount.id },
            data: {
                accessToken: null,
                refreshToken: null,
                deactivatedAt: dayjs().toDate(),
            },
        });

        return;
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
