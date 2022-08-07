import { AuthdataService } from '@authdata/authdata.service.js';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistScraperModule } from '@playlist-scraper/playlist-scraper.module.js';
import { TrackModule } from '@track/track.module.js';
import { StreamAccount } from '@user/user.entity.js';
import { UserModule } from '@user/user.module.js';
import { PlaylistController } from './playlist.controller.js';
import { Playlist, StreamPlaylist } from './playlist.entity.js';
import { PlaylistService } from './playlist.service.js';

@Module({
    imports: [
        PlaylistScraperModule,
        forwardRef(() => UserModule),
        forwardRef(() => TrackModule),
        TypeOrmModule.forFeature([Playlist, StreamPlaylist, StreamAccount]),
    ],
    controllers: [PlaylistController],
    providers: [PlaylistService, AuthdataService],
    exports: [PlaylistService, TypeOrmModule],
})
export class PlaylistModule {}
