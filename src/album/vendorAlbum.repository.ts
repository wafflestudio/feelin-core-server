import { CustomRepository } from '@/dao/custom-repository.decorator.js';
import { Vendors } from '@/types/types.js';
import { In, Repository } from 'typeorm';
import { VendorAlbum } from './entity/vendorAlbum.entity.js';

@CustomRepository(VendorAlbum)
export class VendorAlbumRepository extends Repository<VendorAlbum> {
    findAllWithAlbumById(vendor: Vendors, ids: string[]): Promise<VendorAlbum[]> {
        return this.find({
            where: {
                vendor: vendor,
                vendorId: In(ids),
            },
            relations: ['album'],
        });
    }
}
