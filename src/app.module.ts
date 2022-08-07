import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import ormConfig from './ormConfig.js';
import { TrackModule } from './track/track.module.js';
import { PlaylistModule } from './playlist/playlist.module.js';
import { UserModule } from './user/user.module.js';
import { MeModule } from './me/me.module.js';
import { AlbumModule } from './album/album.module.js';
import { ArtistModule } from './artist/artist.module.js';
import { TrackScraperModule } from './track-scraper/track-scraper.module.js';
import { PlaylistScraperModule } from './playlist-scraper/playlist-scraper.module.js';
import { UserScraperModule } from './user-scraper/user-scraper.module.js';
import getEnvFile from './utils/getEnvFile.js';

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
        UserScraperModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
