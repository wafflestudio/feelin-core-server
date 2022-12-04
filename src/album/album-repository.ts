import { PrismaService } from '@/prisma.service.js';
import { Injectable } from '@nestjs/common';
import { Prisma, PrismaPromise, Album } from '@prisma/client';

@Injectable()
export class AlbumRepository {
    constructor(private readonly prismaService: PrismaService) {}

    create(data: Prisma.AlbumCreateInput, tx?: Prisma.TransactionClient): PrismaPromise<Album> {
        const client = !!tx ? tx : this.prismaService;
        return client.album.create({ data });
    }
}
