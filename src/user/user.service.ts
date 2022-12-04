import { AuthdataService } from '@/authdata/authdata.service.js';
import { UserScraperService } from '@/user-scraper/user-scraper.service.js';
import { CipherUtilService } from '@/utils/cipher-util/cipher-util.service.js';
import { VendorEnum } from '@feelin-types/types.js';
import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import dayjs from 'dayjs';
import { ulid } from 'ulid';
import { LoginStreamRequestDto, LoginStreamResponseDto } from './dto/login-stream.dto.js';
import { SignUpDto } from './dto/signup.dto.js';
import { UserRepository } from './user.repository.js';
import { VendorAccountRepository } from './vendor-account.repository.js';
@Injectable()
export class UserService {
    constructor(
        private readonly userScraperService: UserScraperService,
        private readonly authdataService: AuthdataService,
        private readonly cipherUtilService: CipherUtilService,
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

    async linkStreamAccount(user: User, loginDto: LoginStreamRequestDto): Promise<LoginStreamResponseDto> {
        const { vendor, id, password } = loginDto;

        if (!VendorEnum.includes(vendor)) {
            throw new BadRequestException('Not Implemented', 'unsupported streaming service type');
        }

        const authData = await this.userScraperService.get(vendor).login(id, password);
        if (!authData) {
            throw new UnauthorizedException('Unauthorized', 'login to streaming service failed');
        }
        const authDataString = this.authdataService.toString(vendor, authData);
        const encryptionResult = this.cipherUtilService.encrypt(authDataString);

        const vendorAccount = await this.vendorAccountRepository.create({
            id: ulid(),
            user: { connect: { id: user.id } },
            vendor,
            encryptionKey: encryptionResult.key,
        });

        return new LoginStreamResponseDto(vendorAccount.id, encryptionResult.encryptedData);
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
