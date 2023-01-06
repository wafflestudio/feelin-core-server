import { PrismaService } from '@/prisma.service.js';
import { Injectable } from '@nestjs/common';
import { Artist, Prisma, PrismaPromise } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ArtistRepository {
    constructor(private readonly prismaService: PrismaService) {}

    create(data: Prisma.ArtistCreateInput, tx?: Prisma.TransactionClient): PrismaPromise<Artist> {
        const client = !!tx ? tx : this.prismaService;
        return client.artist.create({ data });
    }

    createWithVendorArtist(input: {
        data: Omit<Prisma.ArtistCreateInput, 'vendorArtists'>;
        vendorArtist: { vendor: string; id: string };
        tx?: Prisma.TransactionClient;
    }): Promise<Artist> {
        const { data, vendorArtist, tx } = input;
        const client = !!tx ? tx : this.prismaService;
        const { vendor, id } = vendorArtist;

        const artist = client.artist.create({
            data: {
                ...data,
                vendorArtists: {
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
        return artist;
    }
}
