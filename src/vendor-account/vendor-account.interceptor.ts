import { AuthService } from '@/auth/auth.service.js';
import { Vendors } from '@/types/types.js';
import { UserScraperService } from '@/user-scraper/user-scraper.service.js';
import { CallHandler, ExecutionContext, Injectable, InternalServerErrorException, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DecryptedVendorAccountDto } from './dto/decrypted-vendor-account.dto.js';

@Injectable()
export class VendorAccountAuthTokenInterceptor implements NestInterceptor {
    constructor(private readonly userScraperService: UserScraperService, private readonly authService: AuthService) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const vendorAccountId = request.headers['vendor-authorization'];

        if (!vendorAccountId) {
            return next.handle();
        }

        const vendorAccount = await this.authService.validateVendorAccountId(vendorAccountId, request.user);
        if (!vendorAccount) {
            throw new InternalServerErrorException('vendor account not found');
        }
        const vendor = vendorAccount.vendor as Vendors;
        const authdata = await this.userScraperService.get(vendor).decryptAndRefreshToken(vendorAccount);
        request.vendorAccount = new DecryptedVendorAccountDto(
            authdata.accessToken,
            authdata.refreshToken,
            authdata.adminToken,
            vendor,
        );

        return next.handle();
    }
}
