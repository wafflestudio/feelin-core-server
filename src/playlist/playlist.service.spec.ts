import { AuthdataService } from '@/authdata/authdata.service.js';
import { TrackModule } from '@/track/track.module.js';
import { User } from '@/user/entity/user.entity.js';
import { UserModule } from '@/user/user.module.js';
import { TypeOrmSQLITETestingModule } from '@/utils/testUtils.js';
import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistModule } from './playlist.module.js';
import { PlaylistService } from './playlist.service.js';
import { VendorAccount } from '@/vendor-account/entity/vendor-account.entity.js';
import { Playlist } from './entity/playlist.entity.js';
import { VendorPlaylist } from './entity/vendorPlaylist.entity.js';

describe('PlaylistService', () => {
    let service: PlaylistService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                PlaylistModule,
                TrackModule,
                UserModule,
                ...TypeOrmSQLITETestingModule([Playlist, VendorPlaylist, User, VendorAccount]),
            ],
            providers: [AuthdataService],
        }).compile();

        service = module.get<PlaylistService>(PlaylistService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
