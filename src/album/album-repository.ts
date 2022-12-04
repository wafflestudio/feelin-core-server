import { PrismaService } from '@/prisma.service.js';
import { Injectable } from '@nestjs/common';
import { Prisma, PrismaPromise, Album } from '@prisma/client';

@Injectable()
export class AlbumRepository {
    constructor(private readonly prismaService: PrismaService) {}

    create(data: Prisma.AlbumCreateInput): PrismaPromise<Album> {
        return this.prismaService.album.create({ data });
    }
}
