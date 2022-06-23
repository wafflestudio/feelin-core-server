import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TrackService } from 'src/track/track.service';
import { User } from 'src/user/user.entity';
import {
    MockRepository,
    testRepositoryModule,
} from 'src/utils/testUtilModules';
import { Playlist } from './playlist.entity';
import { PlaylistService } from './playlist.service';

describe('PlaylistService', () => {
    let service: PlaylistService;
    let playlistRepository: MockRepository<Playlist>;
    let userRepository: MockRepository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PlaylistService,
                TrackService,
                ...testRepositoryModule([Playlist, User]),
            ],
        }).compile();

        service = module.get<PlaylistService>(PlaylistService);
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
