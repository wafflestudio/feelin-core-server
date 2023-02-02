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

    constructor(
        private readonly cipherUtilService: CipherUtilService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly vendorAccountRepository: VendorAccountRepository,
        private readonly userRepository: UserRepository,
    ) {
        this.jwtSecret = this.configService.getOrThrow('JWT_SECRET');
    }

    async validateUserToken(userToken: string): Promise<User> {
        const payload = await this.jwtService.verifyAsync(userToken, { secret: this.jwtSecret }).catch((error) => {
            throw new UnauthorizedException('token expired');
        });
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
        if (vendorAccount.accessToken === null) {
            throw new ForbiddenException('Vendor account is not linked');
        }
        return vendorAccount;
    }
}
