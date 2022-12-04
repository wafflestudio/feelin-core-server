import { PrismaService } from '@/prisma.service.js';
import { Injectable } from '@nestjs/common';
import { Artist, Prisma, PrismaPromise } from '@prisma/client';

@Injectable()
export class ArtistRepository {
    constructor(private readonly prismaService: PrismaService) {}

    create(data: Prisma.ArtistCreateInput, tx?: Prisma.TransactionClient): PrismaPromise<Artist> {
        const client = !!tx ? tx : this.prismaService;
        return client.artist.create({ data });
    }
}
