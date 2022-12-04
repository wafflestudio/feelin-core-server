import { Vendors } from '@/types/types.js';
import { UserRepository } from '@/user/user.repository.js';
import { VendorAccountRepository } from '@/user/vendor-account.repository.js';
import { CipherUtilService } from '@/utils/cipher-util/cipher-util.service.js';
import { DecryptedVendorAccountDto } from '@/vendor-account/dto/decrypted-vendor-account.dto.js';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
    private jwtSecret: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly vendorAccountRepository: VendorAccountRepository,
        private readonly userRepository: UserRepository,
        private readonly cipherUtilService: CipherUtilService,
    ) {
        this.jwtSecret = this.configService.getOrThrow('JWT_SECRET');
    }

    async validateUserToken(userToken: string): Promise<User> {
        const payload = await this.jwtService.verifyAsync(userToken, { secret: this.jwtSecret });
        const user = await this.userRepository.findUniqueOrThrow({ id: payload.userId }).catch(() => {
            throw new UnauthorizedException('unauthorized user');
        });

        return user;
    }

    async validateVendorToken(vendorToken: string, user: User): Promise<DecryptedVendorAccountDto> {
        const payload = await this.jwtService.verifyAsync(vendorToken, { secret: this.jwtSecret });
        const { id, encryptedAuthData } = payload;

        const vendorAccount = await this.vendorAccountRepository.findByIdWithUser(id).catch(() => {
            throw new UnauthorizedException('unauthorized vendor account');
        });
        if (vendorAccount.user.id !== user.id) {
            throw new BadRequestException('vendor account does not belong to user');
        }
        const authData = this.cipherUtilService.decrypt(encryptedAuthData, vendorAccount.encryptionKey);

        return new DecryptedVendorAccountDto(authData, vendorAccount.vendor as Vendors);
    }
}
