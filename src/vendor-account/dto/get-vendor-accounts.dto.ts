import { IsArray, ValidateNested } from 'class-validator';
import { VendorAccountDto } from './vendor-account.dto.js';

export class GetVendorAccountsResponse {
    @IsArray()
    @ValidateNested({ each: true })
    accounts!: VendorAccountDto[];

    constructor(accounts: VendorAccountDto[]) {
        this.accounts = accounts;
    }
}
