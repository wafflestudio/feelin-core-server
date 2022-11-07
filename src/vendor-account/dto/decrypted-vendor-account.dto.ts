import { Vendors } from '@feelin-types/types.js';
import { IsString } from 'class-validator';

export class DecryptedVendorAccountDto {
    @IsString()
    authdata!: string;

    @IsString()
    vendor!: Vendors;

    constructor(authdata: string, vendor: Vendors) {
        this.authdata = authdata;
        this.vendor = vendor;
    }
}
