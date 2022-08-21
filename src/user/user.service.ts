import { Injectable, NotFoundException, NotImplementedException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { StreamServiceEnum } from '@feelin-types/types.js';
import { Repository } from 'typeorm';
import { LoginStreamDto } from './dto/login-stream.dto.js';
import { User } from './user.entity.js';
import { UserScraperService } from '@/user-scraper/user-scraper.service.js';
import { asymmEncrypt, symmEncrypt } from '@utils/cipher.js';
import { Authdata } from '@/authdata/types.js';
import { AuthdataService } from '@/authdata/authdata.service.js';

@Injectable()
export class UserService {
    constructor(
        private readonly userScraperService: UserScraperService,
        private readonly authdataService: AuthdataService,
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {}

    async loginStreamAccount(
        userId: number,
        loginDto: LoginStreamDto,
    ): Promise<{
        symmKey: string;
        publicKey: string;
    }> {
        const { streamType, id, password } = loginDto;

        if (!StreamServiceEnum.includes(streamType)) {
            throw new NotImplementedException('Not Implemented', 'unsupported streaming service type');
        }

        const cookieData: Authdata | null = await this.userScraperService.get(streamType).login(id, password);
        if (cookieData === undefined) {
            throw new UnauthorizedException('Unauthorized', 'login to streaming service failed');
        }

        const user = await this.userRepository.findOne({ id: userId });
        if (user === undefined) {
            throw new NotFoundException('Not Found', 'user not found');
        }

        const { data: cookie, key } = await symmEncrypt(this.authdataService.toString(streamType, cookieData));
        const { data: symmKey, publicKey, privateKey } = await asymmEncrypt(key);
        const hashPubKey = createHash('sha256').update(publicKey).digest('base64url');

        await user.save();

        return {
            symmKey,
            publicKey: hashPubKey,
        };
    }
}
