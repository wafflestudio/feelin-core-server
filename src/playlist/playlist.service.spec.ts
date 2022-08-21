import { AuthdataService } from '@/authdata/authdata.service.js';
import { TrackModule } from '@/track/track.module.js';
import { StreamAccount, User } from '@/user/user.entity.js';
import { UserModule } from '@/user/user.module.js';
import { TypeOrmSQLITETestingModule } from '@/utils/testUtils.js';
import { Test, TestingModule } from '@nestjs/testing';
import { Playlist } from './playlist.entity.js';
import { PlaylistModule } from './playlist.module.js';
import { PlaylistService } from './playlist.service.js';
import { StreamPlaylist } from './streamPlaylist.entity.js';

describe('PlaylistService', () => {
    let service: PlaylistService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                PlaylistModule,
                TrackModule,
                UserModule,
                ...TypeOrmSQLITETestingModule([Playlist, StreamPlaylist, StreamAccount, User]),
            ],
            providers: [AuthdataService],
        }).compile();

        service = module.get<PlaylistService>(PlaylistService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
