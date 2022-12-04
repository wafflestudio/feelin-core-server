import { PrismaService } from '@/prisma.service.js';
import { Injectable } from '@nestjs/common';
import { Playlist, Prisma, PrismaPromise } from '@prisma/client';

@Injectable()
export class PlaylistRepository {
    constructor(private readonly prismaService: PrismaService) {}

    create(data: Prisma.PlaylistCreateInput, tx?: Prisma.TransactionClient): PrismaPromise<Playlist> {
        return !!tx ? tx.playlist.create({ data }) : this.prismaService.playlist.create({ data });
    }

    async findById(id: string): Promise<Playlist> {
        const playlist = await this.prismaService.playlist.findUnique({
            where: { id },
        });
        return playlist;
    }
}
