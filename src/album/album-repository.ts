import { PrismaService } from '@/prisma.service.js';
import { Injectable } from '@nestjs/common';
import { Album, Prisma, PrismaPromise } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AlbumRepository {
    constructor(private readonly prismaService: PrismaService) {}

    create(data: Prisma.AlbumCreateInput, tx?: Prisma.TransactionClient): PrismaPromise<Album> {
        const client = !!tx ? tx : this.prismaService;
        return client.album.create({ data });
    }

    createWithVendorAlbum(input: {
        data: Omit<Prisma.AlbumCreateInput, 'vendorAlbums'>;
        vendorAlbum: { vendor: string; id: string };
        tx?: Prisma.TransactionClient;
    }): Promise<Album> {
        const { data, vendorAlbum, tx } = input;
        const client = !!tx ? tx : this.prismaService;
        const { vendor, id } = vendorAlbum;

        const album = client.album.create({
            data: {
                ...data,
                vendorAlbums: {
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
        return album;
    }
}
