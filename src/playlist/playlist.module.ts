import { AuthdataService } from '@/authdata/authdata.service.js';
import { PlaylistTrack } from '@/playlist/entity/playlist-track.entity.js';
import { User } from '@/user/entity/user.entity.js';
import { VendorAccount } from '@/vendor-account/entity/vendor-account.entity.js';
import { PlaylistScraperModule } from '@/playlist-scraper/playlist-scraper.module.js';
import { TrackModule } from '@/track/track.module.js';
import { UserModule } from '@/user/user.module.js';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistController } from './playlist.controller.js';
import { PlaylistService } from './playlist.service.js';
import { Playlist } from './entity/playlist.entity.js';
import { VendorPlaylist } from './entity/vendor-playlist.entity.js';
import { CustomTypeOrmModule } from '@/dao/custom-typeorm.module.js';
import { VendorTrackRepository } from '@/track/vendor-track.repository.js';
import { VendorArtistRepository } from '@/artist/vendor-artist.repository.js';
import { VendorAlbumRepository } from '@/album/vendor-album.repository.js';
import { PlaylistTrackRepository } from './playlist-track.repository.js';
import { TrackArtist } from '@/track/entity/track-artist.entity.js';

@Module({
    imports: [
        PlaylistScraperModule,
        forwardRef(() => UserModule),
        forwardRef(() => TrackModule),
        TypeOrmModule.forFeature([Playlist, VendorPlaylist, User, VendorAccount, PlaylistTrack, TrackArtist]),
        CustomTypeOrmModule.forCustomRepository([
            PlaylistTrackRepository,
            VendorTrackRepository,
            VendorArtistRepository,
            VendorAlbumRepository,
        ]),
    ],
    controllers: [PlaylistController],
    providers: [PlaylistService, AuthdataService],
    exports: [PlaylistService],
})
export class PlaylistModule {}
