import { JwtAuthGuard } from '@/auth/jwt-auth.guard.js';
import { Vendors } from '@/types/types.js';
import { UserAuthentication } from '@/user/user-authentication.decorator.js';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiFoundResponse, ApiOperation } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { VendorAccountService } from './vendor-account.service.js';

@Controller('vendor-accounts')
export class VendorAccountController {
    constructor(private readonly vendorAccountService: VendorAccountService) {}

    @ApiBearerAuth('Authorization')
    @ApiOperation({ summary: 'Get login url for vendor', description: 'Redirects client to login url for vendor' })
    @ApiFoundResponse()
    @UseGuards(JwtAuthGuard)
    @Get('login')
    async returnLoginUrl(@UserAuthentication() user: User, @Query('vendor') vendor: Vendors) {
        const loginUrl = this.vendorAccountService.getLoginUrl(user, vendor);
        return { code: 302, url: loginUrl };
    }

    @ApiOperation({ summary: 'Callback URL for Spotify login', description: 'Gets access token using received code' })
    @Get('spotify/login')
    async handleSpotifyLogin(@Query('code') code: string, @Query('state') state: string, @Query('error') error: string) {
        if (error && error === 'access_denied') {
            throw new Error('Access denied');
        }
        const vendorAccount = await this.vendorAccountService.handleSpotifyLogin(code, state);
        // TODO: Return user profile
        return { message: 'success' };
    }
}
