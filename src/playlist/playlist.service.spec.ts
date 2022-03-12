import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Album } from 'src/album/album.entity';
import { Artist } from 'src/artist/artist.entity';
import { Track } from 'src/track/track.entity';
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
        expect(data).toBeInstanceOf(Playlist);
        expect(data.title).toEqual('외출준비 할 때 텐션유지를 위한 노래');
        expect(data.tracks[0]).toBeInstanceOf(Track);
        expect(data.tracks[0].album).toBeInstanceOf(Album);
        expect(data.tracks[0].artists[0]).toBeInstanceOf(Artist);
    });
});
