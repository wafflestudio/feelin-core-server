import { PrismaService } from '@/prisma.service.js';
import { Injectable } from '@nestjs/common';
import { Prisma, PrismaPromise, VendorAccount } from '@prisma/client';

@Injectable()
export class VendorAccountRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async findById(id: string): Promise<VendorAccount> {
        const vendorAccount = await this.prismaService.vendorAccount.findUnique({ where: { id } });
        return vendorAccount;
    }

    async findByUserId(userId: string): Promise<VendorAccount[]> {
        const vendorAccounts = await this.prismaService.vendorAccount.findMany({ where: { userId } });
        return vendorAccounts;
    }

    async findByUserIdAndVendor(userId: string, vendor: string): Promise<VendorAccount> {
        const vendorAccount = await this.prismaService.vendorAccount.findFirst({ where: { userId, vendor } });
        return vendorAccount;
    }

    create(data: Prisma.VendorAccountCreateInput, tx?: Prisma.TransactionClient): PrismaPromise<VendorAccount> {
        return (tx ?? this.prismaService).vendorAccount.create({ data });
    }

    update(data: Prisma.VendorAccountUpdateArgs, tx?: Prisma.TransactionClient): PrismaPromise<VendorAccount> {
        return (tx ?? this.prismaService).vendorAccount.update(data);
    }
}
