import { AuthService } from '@/auth/auth.service.js';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class VendorAuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const vendorToken = request.header['Vendor-Authorization'];

        if (!vendorToken) {
            return false;
        }

        const vendorAccount = await this.authService.validateVendorToken(vendorToken, request.user);
        if (!vendorAccount) {
            return false;
        }
        request.vendorAccount = vendorAccount;

        return true;
    }
}
