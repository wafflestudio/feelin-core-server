import { ConflictException, Injectable, NotFoundException, NotImplementedException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { VendorEnum } from '@feelin-types/types.js';
import { Repository } from 'typeorm';
import { LoginStreamDto } from './dto/login-stream.dto.js';
import { UserScraperService } from '@/user-scraper/user-scraper.service.js';
import { asymmEncrypt, symmEncrypt } from '@utils/cipher.js';
import { Authdata } from '@/authdata/types.js';
import { AuthdataService } from '@/authdata/authdata.service.js';
import { User } from '@/user/entity/user.entity.js';
import { SignUpDto } from './dto/signup.dto.js';
@Injectable()
export class UserService {
    constructor(
        private readonly userScraperService: UserScraperService,
        private readonly authdataService: AuthdataService,
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {}

    async signup(signUpDto: SignUpDto): Promise<User> {
        const { id, username } = signUpDto;

        const user = await this.userRepository.findOneBy({ id: id });
        if (user) {
            throw new ConflictException('conflict', 'user already exists');
        }
        return this.userRepository.save(User.create({ id: id, username: username }));
    }

    async loginStreamAccount(
        userId: string,
        loginDto: LoginStreamDto,
    ): Promise<{
        symmKey: string;
        publicKey: string;
    }> {
        const { vendor, id, password } = loginDto;

        if (!VendorEnum.includes(vendor)) {
            throw new NotImplementedException('Not Implemented', 'unsupported streaming service type');
        }

        const cookieData: Authdata | null = await this.userScraperService.get(vendor).login(id, password);
        if (cookieData === undefined) {
            throw new UnauthorizedException('Unauthorized', 'login to streaming service failed');
        }

        const user = await this.userRepository.findOne({
            where: {
                id: userId,
            },
        });
        if (user === undefined) {
            throw new NotFoundException('Not Found', 'user not found');
        }

        const { data: cookie, key } = await symmEncrypt(this.authdataService.toString(vendor, cookieData));
        const { data: symmKey, publicKey, privateKey } = await asymmEncrypt(key);
        const hashPubKey = createHash('sha256').update(publicKey).digest('base64url');

        await user.save();

        return {
            symmKey,
            publicKey: hashPubKey,
        };
    }
}
