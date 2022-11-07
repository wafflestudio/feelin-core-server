import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DecryptedVendorAccountDto } from './dto/decrypted-vendor-account.dto';

export const VendorAuthentication = createParamDecorator((data, ctx: ExecutionContext): DecryptedVendorAccountDto => {
    const req = ctx.switchToHttp().getRequest();
    return req.vendorAccount;
});
