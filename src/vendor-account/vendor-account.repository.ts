import { PrismaService } from '@/prisma.service.js';
import { Injectable } from '@nestjs/common';
import { Prisma, PrismaPromise, User, VendorAccount } from '@prisma/client';

@Injectable()
export class VendorAccountRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async findByIdWithUser(id: string): Promise<VendorAccount & { user: User }> {
        const vendorAccount = await this.prismaService.vendorAccount.findUnique({
            where: { id },
            include: { user: true },
        });
        return vendorAccount;
    }

    create(data: Prisma.VendorAccountCreateInput, tx?: Prisma.TransactionClient): PrismaPromise<VendorAccount> {
        return (tx ?? this.prismaService).vendorAccount.create({ data });
    }

    update(data: Prisma.VendorAccountUpdateArgs, tx?: Prisma.TransactionClient): PrismaPromise<VendorAccount> {
        return (tx ?? this.prismaService).vendorAccount.update(data);
    }
}
