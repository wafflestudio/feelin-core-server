import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
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
}
