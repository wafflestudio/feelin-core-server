import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Playlist } from 'src/playlist/playlist.entity';
import { PlaylistService } from 'src/playlist/playlist.service';
import {
    MockRepository,
    testRepositoryModule,
} from 'src/utils/testUtilModules';
import { loginStreamDto } from './dto/login-stream.dto';
import userFunction from './functions';
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

    // it('should not login to melon', async () => {
    //     jest.setTimeout(10000);
    //     const cookie = await userFunction['melon'].login(
    //         process.env.MELON_ID,
    //         process.env.MELON_PWD_FAKE,
    //     );
    //     expect(cookie).toBeNull();
    //     console.log(cookie);
    // });

    // it('should login to melon', async () => {
    //     jest.setTimeout(10000);
    //     const cookie = await userFunction['melon'].login(
    //         process.env.MELON_ID,
    //         process.env.MELON_PWD,
    //     );
    //     expect(cookie).not.toBeNull();
    //     console.log(cookie);
    // });

    it('should login to flo', async () => {
        const token = await userFunction['flo'].login(
            process.env.FLO_ID,
            process.env.FLO_PWD,
        );
        console.log(token.toCookieString('flo'));
    });

    // it('should connect melon account', async () => {
    //     const loginDto = new loginStreamDto();
    //     loginDto.streamType = 'melon';
    //     loginDto.id = process.env.MELON_ID;
    //     loginDto.password = process.env.MELON_PWD;
    //     const { symmKey, publicKey } = await service.loginStreamAccount(
    //         1,
    //         loginDto,
    //     );
    //     console.log(symmKey, publicKey);
    // });
});
