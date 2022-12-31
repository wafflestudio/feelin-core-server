import { PrismaService } from '@/prisma.service.js';
import { Vendors } from '@/types/types.js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VendorAccount } from '@prisma/client';

@Injectable()
export class VendorAccountService {
    private readonly loginUrls: Record<Vendors, string> = {
        melon: '',
        flo: '',
        spotify: 'https://accounts.spotify.com/authorize?',
    };

    constructor(private readonly prismaService: PrismaService, private readonly configService: ConfigService) {}

    async getVendorAccountById(id: string): Promise<VendorAccount> {
        const vendorAccount = this.prismaService.vendorAccount.findUnique({
            where: { id },
            include: { user: true },
        });
        return vendorAccount;
    }

    getLoginUrl(vendor: Vendors) {
        const loginUrl = this.loginUrls[vendor];

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
                    }).toString()
                );
            default:
                break;
        }
    }
}
