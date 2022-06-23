import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import ormConfig from './ormConfig';
import { TrackModule } from './track/track.module';
import { PlaylistService } from './playlist/playlist.service';
import { PlaylistController } from './playlist/playlist.controller';
import { PlaylistModule } from './playlist/playlist.module';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { TrackController } from './track/track.controller';
import { TrackService } from './track/track.service';
import { UserService } from './user/user.service';
import { getEnvFile } from './utils';
import { MeService } from './me/me.service';
import { MeModule } from './me/me.module';
import { MeController } from './me/me.controller';
import { ArtistService } from './artist/artist.service';
import { AlbumService } from './album/album.service';
import { AlbumModule } from './album/album.module';
import { ArtistModule } from './artist/artist.module';
import { TrackScraperService } from './track-scraper/track-scraper.service';
import { TrackScraperModule } from './track-scraper/track-scraper.module';
import { PlaylistScraperModule } from './playlist-scraper/playlist-scraper.module';
import { PlaylistScraperService } from './playlist-scraper/playlist-scraper.service';
import MelonTrackScraper from './track-scraper/melon';
import FloTrackScraper from './track-scraper/flo';
import { MelonPlaylistScraper } from './playlist-scraper/melon';
import { FloPlaylistScraper } from './playlist-scraper/flo';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [getEnvFile()],
        }),
        TypeOrmModule.forRootAsync({ useFactory: () => ormConfig }),
        TrackModule,
        PlaylistModule,
        UserModule,
        MeModule,
        AlbumModule,
        ArtistModule,
        TrackScraperModule,
        PlaylistScraperModule,
    ],
    controllers: [
        AppController,
        TrackController,
        PlaylistController,
        UserController,
        MeController,
    ],
    providers: [
        AppService,
        TrackService,
        PlaylistService,
        UserService,
        MeService,
        ArtistService,
        AlbumService,
        TrackScraperService,
        MelonTrackScraper,
        FloTrackScraper,
        PlaylistScraperService,
        MelonPlaylistScraper,
        FloPlaylistScraper,
    ],
})
export class AppModule {}
