import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import {
    MockRepository,
    testRepositoryModule,
} from 'src/utils/testUtilModules';
import { floPlaylist } from './functions';
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

    it('should get playlist info', async () => {
        const data = await floPlaylist.getPlaylist('33817');
        // console.log(data);
        console.log(data?.trackList[0]?.album);
        console.log(data?.trackList[0]?.artistList);
    });
});
