import { Vendors } from '@/types/types.js';
import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { VendorAccountService } from './vendor-account.service.js';

@Controller('vendor-account')
export class VendorAccountController {
    constructor(private readonly vendorAccountService: VendorAccountService) {}

    @Get('login')
    @HttpCode(201)
    async returnLoginUrl(@Query('vendor') vendor: Vendors) {
        return this.vendorAccountService.getLoginUrl(vendor);
    }
}
