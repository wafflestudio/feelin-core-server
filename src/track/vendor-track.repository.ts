import { CustomRepository } from '@/dao/custom-repository.decorator.js';
import { Vendors } from '@/types/types.js';
import { In, Repository } from 'typeorm';
import { VendorTrack } from './entity/vendor-track.entity.js';

@CustomRepository(VendorTrack)
export class VendorTrackRepository extends Repository<VendorTrack> {
    async findAllWithTrackByIdAndVendor(vendor: Vendors, ids: string[]): Promise<VendorTrack[]> {
        return this.find({
            where: {
                vendor: vendor,
                vendorId: In(ids),
            },
            relations: ['track'],
        });
    }
}
