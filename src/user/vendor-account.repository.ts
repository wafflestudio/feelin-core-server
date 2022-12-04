import { PrismaService } from '@/prisma.service.js';
import { Injectable } from '@nestjs/common';
import { Prisma, User, VendorAccount } from '@prisma/client';

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

    async update(data: Prisma.VendorAccountUpdateArgs): Promise<VendorAccount> {
        const vendorAccount = await this.prismaService.vendorAccount.update(data);
        return vendorAccount;
    }

    async create(data: Prisma.VendorAccountCreateInput): Promise<VendorAccount> {
        const vendorAccount = await this.prismaService.vendorAccount.create({ data });
        return vendorAccount;
    }
}
