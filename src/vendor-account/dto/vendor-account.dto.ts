import { Vendors } from '@/types/types.js';
import { IsString, IsUUID } from 'class-validator';

export class VendorAccountDto {
    @IsUUID()
    id!: string;

    @IsString()
    vendor!: Vendors;

    constructor(id: string, vendor: Vendors) {
        this.id = id;
        this.vendor = vendor;
    }
}
