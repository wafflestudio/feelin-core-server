import { Vendors } from '@/types/types.js';
import { IsUrl } from 'class-validator';

export class VendorPlaylistDto {
    @IsUrl()
    url!: string;

    vendor!: Vendors;

    constructor(url: string, vendor: Vendors) {
        this.url = url;
        this.vendor = vendor;
    }
}
