import { JwtAuthGuard } from '@/auth/jwt-auth.guard.js';
import { Vendors } from '@/types/types.js';
import { UserAuthentication } from '@/user/user-authentication.decorator.js';
import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { VendorAccountService } from './vendor-account.service.js';

@Controller('vendor-accounts')
export class VendorAccountController {
    constructor(private readonly vendorAccountService: VendorAccountService) {}

    @UseGuards(JwtAuthGuard)
    @Get('login')
    @HttpCode(201)
    async returnLoginUrl(@UserAuthentication() user: User, @Query('vendor') vendor: Vendors) {
        return this.vendorAccountService.getLoginUrl(user, vendor);
    }

    @Get('spotify/callback')
    async handleSpotifyLogin(@Query('code') code: string, @Query('state') state: string, @Query('error') error: string) {
        if (error && error === 'access_denied') {
            throw new Error('Access denied');
        }
        const vendorAccount = await this.vendorAccountService.handleSpotifyLogin(code, state);
        // TODO: Return user profile
        return { message: 'success' };
    }
}
