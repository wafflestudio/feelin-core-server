import { UserRepository } from '@/user/user.repository.js';
import { CipherUtilService } from '@/utils/cipher-util/cipher-util.service.js';
import { VendorAccountRepository } from '@/vendor-account/vendor-account.repository.js';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User, VendorAccount } from '@prisma/client';

@Injectable()
export class AuthService {
    private jwtSecret: string;
    private readonly encryptKey: Buffer;

    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly vendorAccountRepository: VendorAccountRepository,
        private readonly userRepository: UserRepository,
        private readonly cipherUtilService: CipherUtilService,
    ) {
        this.jwtSecret = this.configService.getOrThrow('JWT_SECRET');
        this.encryptKey = Buffer.from(this.configService.getOrThrow<string>('ENCRYPT_KEY'), 'hex');
    }

    async validateUserToken(userToken: string): Promise<User> {
        const payload = await this.jwtService.verifyAsync(userToken, { secret: this.jwtSecret });
        const user = await this.userRepository.findUniqueOrThrow({ id: payload.id }).catch(() => {
            throw new UnauthorizedException('unauthorized user');
        });

        return user;
    }

    async validateVendorAccountId(vendorAccountId: string, user: User): Promise<VendorAccount> {
        const vendorAccount = await this.vendorAccountRepository.findById(vendorAccountId).catch(() => {
            throw new UnauthorizedException('unauthorized vendor account');
        });
        if (vendorAccount.userId !== user.id) {
            throw new ForbiddenException('Vendor account does not belong to user');
        }
        return vendorAccount;
    }
}
