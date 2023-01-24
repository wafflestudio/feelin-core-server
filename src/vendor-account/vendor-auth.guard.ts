import { AuthService } from '@/auth/auth.service.js';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class VendorAuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const vendorAccountId = request.header['Vendor-Authorization'];

        if (!vendorAccountId) {
            return false;
        }

        const vendorAccount = await this.authService.validateVendorAccountId(vendorAccountId, request.user);
        if (!vendorAccount) {
            return false;
        }

        return true;
    }
}
