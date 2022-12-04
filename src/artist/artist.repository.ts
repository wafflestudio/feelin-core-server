import { PrismaService } from '@/prisma.service.js';
import { Injectable } from '@nestjs/common';
import { Artist, Prisma, PrismaPromise } from '@prisma/client';

@Injectable()
export class ArtistRepository {
    constructor(private readonly prismaService: PrismaService) {}

    create(data: Prisma.ArtistCreateInput): PrismaPromise<Artist> {
        return this.prismaService.artist.create({ data });
    }
}
