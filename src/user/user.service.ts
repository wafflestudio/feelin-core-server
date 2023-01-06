import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import dayjs from 'dayjs';
import { VendorAccountRepository } from '../vendor-account/vendor-account.repository.js';
import { SignUpDto } from './dto/signup.dto.js';
import { UserRepository } from './user.repository.js';
@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly vendorAccountRepository: VendorAccountRepository,
    ) {}

    async signup(signUpDto: SignUpDto): Promise<User> {
        const { id, username } = signUpDto;

        const user = await this.userRepository.findUnique({ id });
        if (!!user) {
            throw new ConflictException('conflict', 'user already exists');
        }
        return this.userRepository.create({ id, username });
    }

    async unlinkStreamAccount(user: User, accountId: string): Promise<void> {
        const vendorAccount = await this.vendorAccountRepository.findByIdWithUser(accountId).catch(() => {
            throw new NotFoundException('Not Found', 'vendor account not found');
        });
        if (vendorAccount.user.id !== user.id) {
            throw new UnauthorizedException('Unauthorized', 'vendor account does not belong to user');
        }

        await this.vendorAccountRepository.update({
            where: { id: vendorAccount.id },
            data: { deactivatedAt: dayjs().toDate() },
        });

        return;
    }
}
