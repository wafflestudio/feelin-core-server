import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CookieData } from 'src/types';
import { asymmEncrypt, symmEncrypt } from 'src/utils/cipher';
import { Repository } from 'typeorm';
import { loginStreamDto } from './dto/login-stream.dto';
import login from './functions/login';
import { StreamAccount, User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {}

    async loginStreamAccount(
        userId: number,
        loginDto: loginStreamDto,
    ): Promise<{
        symmKey: string;
        publicKey: string;
    }> {
        const { streamType, id, password } = loginDto;
        const loginFunc = login[streamType];

        if (loginFunc === undefined) {
            console.error(`unsupported streaming service type: ${streamType}`);
            return;
        }

        const cookieData: CookieData | null = await loginFunc(id, password);
        if (cookieData === null) {
            console.error('streaming account login failed');
            return;
        }

        const user = await this.userRepository.findOne({ id: userId });
        if (user === null) {
            console.error(`no user with id ${userId} found`);
            return;
        }

        const { data: cookie, key } = await symmEncrypt(cookieData.toString());
        const {
            data: symmKey,
            publicKey,
            privateKey,
        } = await asymmEncrypt(key);

        const streamAccount = new StreamAccount(
            streamType,
            cookie,
            publicKey,
            privateKey,
        );
        user.streamAccounts = [...user.streamAccounts, streamAccount];
        await user.save();

        return {
            symmKey,
            publicKey,
        };
    }
}
