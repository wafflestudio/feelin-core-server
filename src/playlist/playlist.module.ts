import { AlbumRepository } from '@/album/album-repository.js';
import { VendorAlbumRepository } from '@/album/vendor-album.repository.js';
import { ArtistRepository } from '@/artist/artist.repository.js';
import { VendorArtistRepository } from '@/artist/vendor-artist.repository.js';
import { AuthModule } from '@/auth/auth.module.js';
import { PlaylistScraperModule } from '@/playlist-scraper/playlist-scraper.module.js';
import { PrismaService } from '@/prisma.service.js';
import { TrackModule } from '@/track/track.module.js';
import { forwardRef, Module } from '@nestjs/common';
import { TrackMatcherModule } from './../track-matcher/track-matcher.module.js';
import { PlaylistController } from './playlist.controller.js';
import { PlaylistRepository } from './playlist.repository.js';
import { PlaylistService } from './playlist.service.js';
import { VendorPlaylistRepository } from './vendor-playlist.repository.js';

@Module({
    imports: [PlaylistScraperModule, TrackMatcherModule, forwardRef(() => TrackModule), forwardRef(() => AuthModule)],
    controllers: [PlaylistController],
    providers: [
        PlaylistService,
        PrismaService,
        PlaylistRepository,
        ArtistRepository,
        AlbumRepository,
        VendorPlaylistRepository,
        VendorArtistRepository,
        VendorAlbumRepository,
    ],
    exports: [PlaylistService, PlaylistRepository, VendorPlaylistRepository],
})
export class PlaylistModule {}
