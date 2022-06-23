import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Album } from 'src/album/album.entity';
import { Artist } from 'src/artist/artist.entity';
import { Track } from 'src/track/track.entity';
import { TrackService } from 'src/track/track.service';
import UserManagers from 'src/user/functions';
import { User } from 'src/user/user.entity';
import {
    MockRepository,
    testRepositoryModule,
} from 'src/utils/testUtilModules';
import { Playlist } from './playlist.entity';
import { PlaylistService } from './playlist.service';

jest.setTimeout(100000);
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

    // it('should get playlist info', async () => {
    //     const playlist = await PlaylistManagers['flo'].getPlaylist('33817');
    //     expect(playlist).toBeInstanceOf(Playlist);
    //     expect(playlist.title).toEqual('외출준비 할 때 텐션유지를 위한 노래');
    //     expect(playlist.tracks[0]).toBeInstanceOf(Track);
    //     expect(playlist.tracks[0].album).toBeInstanceOf(Album);
    //     expect(playlist.tracks[0].artists[0]).toBeInstanceOf(Artist);
    // });

    // it('should save playlist', async () => {
    //     try {
    //         const playlist = await PlaylistManagers['flo'].getPlaylist('33817');
    //         const token = await UserManagers['flo'].login(
    //             process.env.FLO_ID,
    //             process.env.FLO_PWD,
    //         );
    //         await PlaylistManagers['flo'].savePlaylist(playlist, token);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // });

    // it('should match playlist', async () => {
    //     try {
    //         const playlist = await PlaylistManagers['flo'].getPlaylist('28571');
    //         const matchedPlaylist = await service.getMatchedTracks(playlist);
    //         for (const track of matchedPlaylist.tracks) {
    //             // console.log(track.title);
    //             // console.log(track.streamTracks);
    //         }
    //         console.log('done!');
    //     } catch (e) {
    //         console.error(e);
    //     }
    // });

    it('should match and save playlist', async () => {
        try {
            const playlist = await PlaylistManagers['flo'].getPlaylist('34052');
            await service.getMatchedTracks(playlist);
            const cookie = await UserManagers['melon'].login(
                process.env.MELON_ID,
                process.env.MELON_PWD,
            );
            await PlaylistManagers['melon'].savePlaylist(playlist, cookie);
        } catch (error) {
            console.error(error);
        }
    });
    // it('Benchmark', async () => {
    //     // Initial: 24s
    //     // Promise.all: 12s
    //     try {
    //         let total = 0;
    //         let missing = 0;
    //         for (let i = 31234; i < 31250; i++) {
    //             const playlist = await PlaylistManagers['flo'].getPlaylist(
    //                 i.toString(),
    //             );
    //             if (playlist.tracks) {
    //                 const matchedPlaylist = await service.getMatchedTracks(
    //                     playlist,
    //                 );
    //                 for (const track of matchedPlaylist.tracks) {
    //                     // console.log(track.streamTracks);
    //                     total++;
    //                     if (track.streamTracks[1] == null) {
    //                         missing++;
    //                     }
    //                 }
    //                 console.log('done!');
    //             } else {
    //                 console.log('fail: ', i);
    //             }
    //         }
    //         console.log(`total ${total} tracks, missing ${missing} tracks`);
    //         console.log(`${(missing / total) * 100}% tracks missing`);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // });
});
