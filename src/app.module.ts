import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [getEnvFile()],
        }),
        TypeOrmModule.forRoot(ormConfig),
        TrackModule,
        PlaylistModule,
        UserModule,
        MeModule,
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
    ],
})
export class AppModule {}
