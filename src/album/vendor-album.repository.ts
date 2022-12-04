import { PrismaService } from '@/prisma.service.js';
import { Vendors } from '@/types/types.js';
import { Injectable } from '@nestjs/common';
import { Album, VendorAlbum } from '@prisma/client';

@Injectable()
export class VendorAlbumRepository {
    constructor(private readonly prismaService: PrismaService) {}

    findAllWithAlbumById(vendor: Vendors, ids: string[]): Promise<VendorAlbumWithAlbum[]> {
        return this.prismaService.vendorAlbum.findMany({
            where: {
                vendor,
                albumId: { in: ids },
            },
            include: {
                album: true,
            },
        });
    }
}

export type VendorAlbumWithAlbum = VendorAlbum & { album: Album };
