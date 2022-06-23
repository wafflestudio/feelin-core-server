import {
    Injectable,
    NotFoundException,
    NotImplementedException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { AuthData, StreamServiceEnum } from 'src/types';
import { UserScraperService } from 'src/user-scraper/user-scraper.service';
import { asymmEncrypt, symmEncrypt } from 'src/utils/cipher';
import { Repository } from 'typeorm';
import { LoginStreamDto } from './dto/login-stream.dto';
import { StreamAccount, User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        private readonly userScraperService: UserScraperService,
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
            throw new NotImplementedException(
                'Not Implemented',
                'unsupported streaming service type',
            );
        }

        const cookieData: AuthData | null = await this.userScraperService
            .get(streamType)
            .login(id, password);
        if (cookieData === undefined) {
            throw new UnauthorizedException(
                'Unauthorized',
                'login to streaming service failed',
            );
        }

        const user = await this.userRepository.findOne({ id: userId });
        if (user === undefined) {
            throw new NotFoundException('Not Found', 'user not found');
        }

        const { data: cookie, key } = await symmEncrypt(
            cookieData.toString(streamType),
        );
        const {
            data: symmKey,
            publicKey,
            privateKey,
        } = await asymmEncrypt(key);
        const hashPubKey = createHash('sha256')
            .update(publicKey)
            .digest('base64url');

        const streamAccount = new StreamAccount(
            streamType,
            cookie,
            hashPubKey,
            privateKey,
        );

        if (user.streamAccounts === undefined) {
            user.streamAccounts = [];
        }
        user.streamAccounts.push(streamAccount);
        await user.save();

        return {
            symmKey,
            publicKey: hashPubKey,
        };
    }
}
