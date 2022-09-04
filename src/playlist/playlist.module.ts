import { AuthdataService } from '@/authdata/authdata.service.js';
import { PlaylistTrack } from '@/playlist/entity/playlist-track.entity.js';
import { User } from '@/user/entity/user.entity.js';
import { VendorUser } from '@/user/entity/vendorUser.entity.js';
import { PlaylistScraperModule } from '@/playlist-scraper/playlist-scraper.module.js';
import { TrackModule } from '@/track/track.module.js';
import { UserModule } from '@/user/user.module.js';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistController } from './playlist.controller.js';
import { PlaylistService } from './playlist.service.js';
import { Playlist } from './entity/playlist.entity.js';
import { VendorPlaylist } from './entity/vendorPlaylist.entity.js';
import { CustomTypeOrmModule } from '@/dao/custom-typeorm.module.js';
import { VendorTrackRepository } from '@/track/vendorTrack.repository.js';
import { VendorArtistRepository } from '@/artist/vendorArtist.repository.js';
import { VendorAlbumRepository } from '@/album/vendorAlbum.repository.js';
import { PlaylistTrackRepository } from './playlistTrack.repository.js';
import { TrackArtist } from '@/track/entity/track-artist.entity.js';

@Module({
    imports: [
        PlaylistScraperModule,
        forwardRef(() => UserModule),
        forwardRef(() => TrackModule),
        TypeOrmModule.forFeature([Playlist, VendorPlaylist, User, VendorUser, PlaylistTrack, TrackArtist]),
        CustomTypeOrmModule.forCustomRepository(PlaylistTrackRepository),
        CustomTypeOrmModule.forCustomRepository(VendorTrackRepository),
        CustomTypeOrmModule.forCustomRepository(VendorArtistRepository),
        CustomTypeOrmModule.forCustomRepository(VendorAlbumRepository),
    ],
    controllers: [PlaylistController],
    providers: [PlaylistService, AuthdataService],
    exports: [PlaylistService],
})
export class PlaylistModule {}
