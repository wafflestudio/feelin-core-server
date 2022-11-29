import { CustomRepository } from '@/dao/custom-repository.decorator.js';
import { Vendors } from '@/types/types.js';
import { In, Repository } from 'typeorm';
import { VendorArtist } from './entity/vendor-artist.entity.js';

@CustomRepository(VendorArtist)
export class VendorArtistRepository extends Repository<VendorArtist> {
    findAllWithArtistById(vendor: Vendors, ids: string[]): Promise<VendorArtist[]> {
        return this.find({
            where: {
                vendor: vendor,
                vendorId: In(ids),
            },
            relations: ['artist'],
        });
    }
}
