import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VendorAccount } from './entity/vendor-account.entity.js';

@Injectable()
export class VendorAccountService {
    constructor(
        @InjectRepository(VendorAccount)
        private readonly vendorAccountRepository: Repository<VendorAccount>,
    ) {}

    async getVendorAccountById(id: string): Promise<VendorAccount> {
        return this.vendorAccountRepository.findOneOrFail({ where: { id }, relations: ['user'] }).catch(() => {
            throw new NotFoundException('vendor account not found');
        });
    }
}
