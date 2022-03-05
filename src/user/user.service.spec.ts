import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistModule } from 'src/playlist/playlist.module';
import testUtilModule from 'src/utils/testUtilModules';
import { loginStreamDto } from './dto/login-stream.dto';
import { UserController } from './user.controller';
import { UserModule } from './user.module';
import { UserService } from './user.service';

describe('UserService', () => {
    let service: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [...testUtilModule(), UserModule, PlaylistModule],
            providers: [UserService],
            controllers: [UserController],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should log in to melon', async () => {
        const loginDto = new loginStreamDto();
        loginDto.streamType = 'melon';
        loginDto.id = process.env.MELON_ID;
        loginDto.password = process.env.MELON_ID;
        const { symmKey, publicKey } = await service.loginStreamAccount(
            1,
            loginDto,
        );
        console.log(symmKey, publicKey);
    });
});
