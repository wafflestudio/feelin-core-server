import { AuthdataService } from '@/authdata/authdata.service.js';
import { UserScraperService } from '@/user-scraper/user-scraper.service.js';
import { User } from '@/user/entity/user.entity.js';
import { CipherUtilService } from '@/utils/cipher-util/cipher-util.service.js';
import { VendorAccount } from '@/vendor-account/entity/vendor-account.entity.js';
import { VendorEnum } from '@feelin-types/types.js';
import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { LoginStreamRequestDto, LoginStreamResponseDto } from './dto/login-stream.dto.js';
import { SignUpDto } from './dto/signup.dto.js';
@Injectable()
export class UserService {
    constructor(
        private readonly userScraperService: UserScraperService,
        private readonly authdataService: AuthdataService,
        private readonly cipherUtilService: CipherUtilService,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(VendorAccount) private vendorAccountRepository: Repository<VendorAccount>,
    ) {}

    async signup(signUpDto: SignUpDto): Promise<User> {
        const { id, username } = signUpDto;

        const user = await this.userRepository.findOneBy({ id });
        if (user) {
            throw new ConflictException('conflict', 'user already exists');
        }
        return this.userRepository.save(User.create({ id, username }));
    }

    async linkStreamAccount(user: User, loginDto: LoginStreamRequestDto): Promise<LoginStreamResponseDto> {
        const { vendor, id, password } = loginDto;

        if (!VendorEnum.includes(vendor)) {
            throw new BadRequestException('Not Implemented', 'unsupported streaming service type');
        }

        const authData = await this.userScraperService.get(vendor).login(id, password);
        if (!!authData) {
            throw new UnauthorizedException('Unauthorized', 'login to streaming service failed');
        }
        const authDataString = this.authdataService.toString(vendor, authData);
        const encryptionResult = this.cipherUtilService.encrypt(authDataString);

        let vendorAccount = VendorAccount.create({ id: randomUUID(), user, vendor, encryptionKey: encryptionResult.key });
        vendorAccount = await this.vendorAccountRepository.save(vendorAccount);

        return new LoginStreamResponseDto(vendorAccount.id, vendorAccount.encryptionKey.toString('hex'));
    }

    async unlinkStreamAccount(user: User, accountId: string): Promise<void> {
        const vendorAccount = await this.vendorAccountRepository.findOneByOrFail({ id: accountId }).catch(() => {
            throw new NotFoundException('Not Found', 'vendor account not found');
        });
        vendorAccount.isActive = false;
        await this.vendorAccountRepository.save(vendorAccount);

        return;
    }

    async findByUserId(userId: string): Promise<User> {
        return this.userRepository.findOneByOrFail({ id: userId }).catch(() => {
            throw new NotFoundException('Not Found', 'user not found');
        });
    }
}
