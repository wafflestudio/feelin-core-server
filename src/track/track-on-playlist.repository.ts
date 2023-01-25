import { PrismaService } from '@/prisma.service.js';
import { Injectable } from '@nestjs/common';
import { Prisma, PrismaPromise } from '@prisma/client';

@Injectable()
export class TrackOnPlaylistRepository {
    constructor(private readonly prismaService: PrismaService) {}

    updateMany(
        data: Prisma.TrackOnPlaylistUpdateInput,
        where: Prisma.TrackOnPlaylistWhereInput,
    ): PrismaPromise<Prisma.BatchPayload> {
        return this.prismaService.vendorAlbum.updateMany({ data, where });
    }
}
