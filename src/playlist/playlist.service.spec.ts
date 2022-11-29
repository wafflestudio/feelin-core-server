import { AuthdataService } from '@/authdata/authdata.service.js';
import { TrackModule } from '@/track/track.module.js';
import { User } from '@/user/entity/user.entity.js';
import { UserModule } from '@/user/user.module.js';
import { createTestingModule } from '@/utils/test-utils.js';
import { VendorAccount } from '@/vendor-account/entity/vendor-account.entity.js';
import { TestingModule } from '@nestjs/testing';
import { Playlist } from './entity/playlist.entity.js';
import { VendorPlaylist } from './entity/vendor-playlist.entity.js';
import { PlaylistModule } from './playlist.module.js';
import { PlaylistService } from './playlist.service.js';

describe('PlaylistService', () => {
    let service: PlaylistService;

    beforeEach(async () => {
        const module: TestingModule = await createTestingModule({
            imports: [PlaylistModule, TrackModule, UserModule],
            providers: [AuthdataService],
            entities: [Playlist, VendorPlaylist, User, VendorAccount],
        });

        service = module.get<PlaylistService>(PlaylistService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
