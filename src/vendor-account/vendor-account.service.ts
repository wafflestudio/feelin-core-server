import { PrismaService } from '@/prisma.service.js';
import { Injectable } from '@nestjs/common';
import { VendorAccount } from '@prisma/client';

@Injectable()
export class VendorAccountService {
    constructor(private readonly prismaService: PrismaService) {}

    async getVendorAccountById(id: string): Promise<VendorAccount> {
        const vendorAccount = this.prismaService.vendorAccount.findUnique({
            where: { id },
            include: { user: true },
        });
        return vendorAccount;
    }
}
