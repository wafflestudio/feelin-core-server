import { PrismaService } from '@/prisma.service.js';
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async findUnique(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User | null> {
        const user = await this.prismaService.user.findUnique({
            where: userWhereUniqueInput,
        });
        return user;
    }

    async findUniqueOrThrow(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User> {
        const user = await this.prismaService.user.findUniqueOrThrow({
            where: userWhereUniqueInput,
        });
        return user;
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        const user = await this.prismaService.user.create({ data });
        return user;
    }
}
