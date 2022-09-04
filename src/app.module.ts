import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AlbumModule } from './album/album.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ArtistModule } from './artist/artist.module.js';
import { AuthdataService } from './authdata/authdata.service.js';
import { MeModule } from './me/me.module.js';
import { PlaylistScraperModule } from './playlist-scraper/playlist-scraper.module.js';
import { PlaylistModule } from './playlist/playlist.module.js';
import { TrackScraperModule } from './track-scraper/track-scraper.module.js';
import { TrackModule } from './track/track.module.js';
import { UserScraperModule } from './user-scraper/user-scraper.module.js';
import { UserModule } from './user/user.module.js';
import { getEnvFile } from './utils/getEnvFile.js';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [getEnvFile()],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get('DB_HOST'),
                port: +configService.get('DB_PORT') || 3306,
                username: configService.get('DB_USER'),
                password: configService.get('DB_PWD'),
                database: configService.get('DB_NAME'),
                entities: ['dist/**/*.entity{.ts,.js}'],
                synchronize: true,
                migrations: ['dist/migration/*.js'],
                migrationsRun: true,
                cli: {
                    migrationsDir: 'src/migration',
                },
                dropSchema: !process.env.NODE_ENV || process.env.NODE_ENV === 'dev',
                logging: true,
            }),
            inject: [ConfigService],
        }),
        AlbumModule,
        ArtistModule,
        MeModule,
        PlaylistModule,
        PlaylistScraperModule,
        TrackModule,
        TrackScraperModule,
        UserModule,
        UserScraperModule,
    ],
    controllers: [AppController],
    providers: [AppService, AuthdataService],
})
export class AppModule {
    constructor(private dataSource: DataSource) {}
}
