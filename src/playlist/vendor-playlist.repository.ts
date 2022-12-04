import { PrismaService } from '@/prisma.service.js';
import { Vendors } from '@/types/types.js';
import { Injectable } from '@nestjs/common';
import { Playlist, Prisma, PrismaPromise, VendorPlaylist } from '@prisma/client';

@Injectable()
export class VendorPlaylistRepository {
    constructor(private readonly prismaService: PrismaService) {}

    upsert(data: Prisma.VendorPlaylistUpsertArgs): PrismaPromise<VendorPlaylist> {
        return this.prismaService.vendorPlaylist.upsert(data);
    }

    async findWithPlaylistById(vendorId: string, vendor: Vendors): Promise<VendorPlaylistWithPlaylist> {
        return this.prismaService.vendorPlaylist.findUnique({
            where: { vendorId_vendor: { vendorId, vendor } },
            include: { playlist: true },
        });
    }
}

export type VendorPlaylistWithPlaylist = VendorPlaylist & { playlist: Playlist };
