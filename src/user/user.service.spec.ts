import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Playlist } from 'src/playlist/playlist.entity';
import { PlaylistService } from 'src/playlist/playlist.service';
import {
    MockRepository,
    testRepositoryModule,
} from 'src/utils/testUtilModules';
import { loginStreamDto } from './dto/login-stream.dto';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
    let service: UserService;
    let playlistRepository: MockRepository<Playlist>;
    let userRepository: MockRepository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                PlaylistService,
                ...testRepositoryModule([User, Playlist]),
            ],
            controllers: [UserController],
        }).compile();

        service = module.get<UserService>(UserService);
        playlistRepository = module.get<MockRepository<Playlist>>(
            getRepositoryToken(Playlist),
        );
        userRepository = module.get<MockRepository<User>>(
            getRepositoryToken(User),
        );
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
