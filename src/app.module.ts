import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AlbumModule } from './album/album.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ArtistScraperService } from './artist-scraper/artist-scraper.service.js';
import { ArtistModule } from './artist/artist.module.js';
import { AuthModule } from './auth/auth.module.js';
import { AuthService } from './auth/auth.service.js';
import { MeModule } from './me/me.module.js';
import { PlaylistScraperModule } from './playlist-scraper/playlist-scraper.module.js';
import { PlaylistModule } from './playlist/playlist.module.js';
import { PrismaService } from './prisma.service.js';
import { TrackMatcherModule } from './track-matcher/track-matcher.module.js';
import { TrackScraperModule } from './track-scraper/track-scraper.module.js';
import { TrackModule } from './track/track.module.js';
import { UserScraperModule } from './user-scraper/user-scraper.module.js';
import { UserModule } from './user/user.module.js';
import { CipherUtilService } from './utils/cipher-util/cipher-util.service.js';
import { CookieUtilService } from './utils/cookie-util/cookie-util.service.js';
import { getEnvFile } from './utils/get-env-file.js';
import { ImagePickerUtilService } from './utils/image-picker-util/image-picker-util.service.js';
import { SimilarityUtilService } from './utils/similarity-util/similarity-util.service.js';
import { SlackUtilService } from './utils/slack-util/slack-util.service.js';
import { VendorAccountAuthTokenInterceptor } from './vendor-account/vendor-account.interceptor.js';
import { VendorAccountModule } from './vendor-account/vendor-account.module.js';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env', getEnvFile()],
        }),
        AlbumModule,
        AuthModule,
        ArtistModule,
        MeModule,
        PlaylistModule,
        PlaylistScraperModule,
        TrackModule,
        TrackScraperModule,
        UserModule,
        UserScraperModule,
        VendorAccountModule,
        JwtModule,
        TrackMatcherModule,
    ],
    controllers: [AppController],
    providers: [
        {
            provide: 'APP_INTERCEPTOR',
            useClass: VendorAccountAuthTokenInterceptor,
        },
        AppService,
        PrismaService,
        AuthService,
        CipherUtilService,
        SimilarityUtilService,
        CookieUtilService,
        ImagePickerUtilService,
        ArtistScraperService,
        SlackUtilService,
    ],
})
export class AppModule {}
