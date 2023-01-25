import { AuthModule } from '@/auth/auth.module.js';
import { PlaylistModule } from '@/playlist/playlist.module.js';
import { PrismaService } from '@/prisma.service.js';
import { UserScraperModule } from '@/user-scraper/user-scraper.module.js';
import { CipherUtilService } from '@/utils/cipher-util/cipher-util.service.js';
import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller.js';
import { UserRepository } from './user.repository.js';
import { UserService } from './user.service.js';

@Module({
    imports: [forwardRef(() => PlaylistModule), forwardRef(() => AuthModule), UserScraperModule],
    controllers: [UserController],
    providers: [UserService, CipherUtilService, PrismaService, UserRepository],
    exports: [UserService, UserRepository],
})
export class UserModule {}
