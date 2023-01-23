import { PrismaService } from '@/prisma.service.js';
import { Vendors } from '@/types/types.js';
import { Injectable } from '@nestjs/common';
import { Prisma, PrismaPromise, Track, VendorTrack } from '@prisma/client';

@Injectable()
export class VendorTrackRepository {
    constructor(private readonly prismaService: PrismaService) {}

    create(data: Prisma.VendorTrackCreateInput): PrismaPromise<VendorTrack> {
        return this.prismaService.vendorTrack.create({ data });
    }

    update(data: Prisma.VendorTrackUpdateInput, where: Prisma.VendorTrackWhereUniqueInput): PrismaPromise<VendorTrack> {
        return this.prismaService.vendorTrack.update({ data, where });
    }

    async findAllWithTrackByIdAndVendor(vendor: Vendors, ids: string[]): Promise<VendorTrackWithTrack[]> {
        return this.prismaService.vendorTrack.findMany({
            where: {
                vendor,
                vendorId: { in: ids },
            },
            include: { track: true },
        });
    }

    async findAllByTrackId(trackId: string): Promise<VendorTrack[]> {
        return this.prismaService.vendorTrack.findMany({ where: { trackId } });
    }

    async findAllStreamTracks(trackIds: string[], vendor: Vendors): Promise<{ [trackId: string]: VendorTrack }> {
        const vendorTracks = await this.prismaService.vendorTrack.findMany({
            where: {
                vendor,
                trackId: { in: trackIds },
            },
        });

        return vendorTracks.reduce((acc, vendorTrack) => {
            acc[vendorTrack.trackId] = vendorTrack;
            return acc;
        }, {});
    }
}

export type VendorTrackWithTrack = VendorTrack & { track: Track };
