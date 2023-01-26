import { PrismaService } from '@/prisma.service.js';
import { Injectable } from '@nestjs/common';
import { Playlist, Prisma, PrismaPromise } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PlaylistRepository {
    constructor(private readonly prismaService: PrismaService) {}

    create(data: Prisma.PlaylistCreateInput, tx?: Prisma.TransactionClient): PrismaPromise<Playlist> {
        return !!tx ? tx.playlist.create({ data }) : this.prismaService.playlist.create({ data });
    }

    async createWithVendorPlaylist(input: {
        data: Omit<Prisma.PlaylistCreateInput, 'vendorPlaylists'>;
        vendorPlaylist: { vendor: string; id: string };
        tx?: Prisma.TransactionClient;
    }): Promise<Playlist> {
        const { data, vendorPlaylist, tx } = input;
        const client = !!tx ? tx : this.prismaService;
        const { vendor, id } = vendorPlaylist;

        const playlist = await client.playlist.create({
            data: {
                ...data,
                vendorPlaylist: {
                    connectOrCreate: {
                        where: { vendorId_vendor: { vendorId: id, vendor } },
                        create: {
                            id: uuidv4(),
                            vendor,
                            vendorId: id,
                        },
                    },
                },
            },
        });
        return playlist;
    }

    async findById(id: string): Promise<Playlist> {
        const playlist = await this.prismaService.playlist.findUnique({ where: { id } });
        return playlist;
    }
}
