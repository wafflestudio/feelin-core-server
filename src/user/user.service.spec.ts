import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Playlist } from 'src/playlist/playlist.entity';
import { PlaylistService } from 'src/playlist/playlist.service';
import {
    MockRepository,
    testRepositoryModule,
} from 'src/utils/testUtilModules';
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
});
