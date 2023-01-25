import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { SignUpDto } from './dto/signup.dto.js';
import { UserRepository } from './user.repository.js';
@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async signup(signUpDto: SignUpDto): Promise<User> {
        const { id, username } = signUpDto;

        const user = await this.userRepository.findUnique({ id });
        if (!!user) {
            throw new ConflictException('conflict', 'user already exists');
        }
        return this.userRepository.create({ id, username });
    }

    async delete(id: string): Promise<void> {
        await this.userRepository.delete({ id });
    }
}
