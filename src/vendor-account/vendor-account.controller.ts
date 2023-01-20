import { JwtAuthGuard } from '@/auth/jwt-auth.guard.js';
import { Vendors } from '@/types/types.js';
import { UserAuthentication } from '@/user/user-authentication.decorator.js';
import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiFoundResponse, ApiOperation } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { VendorAccountLoginDto } from './dto/vendor-account-login.dto.js';
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
        const loginUrl = await this.vendorAccountService.getLoginUrl(user, vendor);
        return { statusCode: 302, url: loginUrl };
    }

    @ApiOperation({ summary: 'Login to a vendor account', description: '' })
    @UseGuards(JwtAuthGuard)
    @Post(':vendor/login')
    async handleLogin(
        @Body() vendorAccountLoginDto: VendorAccountLoginDto,
        @Param('vendor') vendor: Vendors,
        @UserAuthentication() user: User,
    ) {
        const vendorAccount = await this.vendorAccountService.handleVendorAccountLogin(vendorAccountLoginDto, vendor, user);
        return { message: 'success' };
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
