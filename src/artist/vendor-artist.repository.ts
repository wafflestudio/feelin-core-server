import { PrismaService } from '@/prisma.service.js';
import { Vendors } from '@/types/types.js';
import { Injectable } from '@nestjs/common';
import { Artist, VendorArtist } from '@prisma/client';

@Injectable()
export class VendorArtistRepository {
    constructor(private readonly prismaService: PrismaService) {}

    findAllWithArtistById(vendor: Vendors, ids: string[]): Promise<VendorArtistWithArtist[]> {
        return this.prismaService.vendorArtist.findMany({
            where: {
                vendor,
                artistId: { in: ids },
            },
            include: {
                artist: true,
            },
        });
    }
}

export type VendorArtistWithArtist = VendorArtist & { artist: Artist };
