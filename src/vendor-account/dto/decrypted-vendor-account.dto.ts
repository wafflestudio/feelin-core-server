import { Vendors } from '@feelin-types/types.js';
import { IsString } from 'class-validator';

export class DecryptedVendorAccountDto {
    authdata!: Authdata;

    @IsString()
    vendor!: Vendors;

    constructor(accessToken: string, refreshToken: string | null, adminToken: string | null, vendor: Vendors) {
        this.authdata = { accessToken, refreshToken, adminToken };
        this.vendor = vendor;
    }
}

export type Authdata = {
    accessToken: string;
    refreshToken: string | null;
    adminToken: string | null;
};
