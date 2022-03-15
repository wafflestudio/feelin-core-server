import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Album } from 'src/album/album.entity';
import { Artist } from 'src/artist/artist.entity';
import { Track } from 'src/track/track.entity';
import userFunction from 'src/user/functions';
import { User } from 'src/user/user.entity';
import {
    MockRepository,
    testRepositoryModule,
} from 'src/utils/testUtilModules';
import playlistFunction from './functions';
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
        const playlist = await playlistFunction['flo'].getPlaylist('33817');
        expect(playlist).toBeInstanceOf(Playlist);
        expect(playlist.title).toEqual('외출준비 할 때 텐션유지를 위한 노래');
        expect(playlist.tracks[0]).toBeInstanceOf(Track);
        expect(playlist.tracks[0].album).toBeInstanceOf(Album);
        expect(playlist.tracks[0].artists[0]).toBeInstanceOf(Artist);
    });

    it('should save playlist', async () => {
        try {
            const playlist = await playlistFunction['flo'].getPlaylist('33817');
            const token = await userFunction['flo'].login(
                process.env.FLO_ID,
                process.env.FLO_PWD,
            );
            await playlistFunction['flo'].savePlaylist(playlist, token);
        } catch (error) {
            console.error(error);
        }
    });
});
