import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Playlist } from '@playlist/playlist.entity.js';
import { PlaylistService } from '@playlist/playlist.service.js';
import { MockRepository, testRepositoryModule } from '@utils/testUtils.js';
import { UserController } from './user.controller.js';
import { User } from './user.entity.js';
import { UserService } from './user.service.js';

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
