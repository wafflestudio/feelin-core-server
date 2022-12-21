import { AuthdataService } from '@/authdata/authdata.service.js';
import { VendorPlaylistRepository } from '@/playlist/vendor-playlist.repository.js';
import { PrismaService } from '@/prisma.service.js';
import { TrackScraperModule } from '@/track-scraper/track-scraper.module.js';
import { TrackModule } from '@/track/track.module.js';
import { Module } from '@nestjs/common';
import { FloPlaylistScraper } from './flo-playlist-scraper.service.js';
import { MelonPlaylistScraper } from './melon-playlist-scraper.service.js';
import { PlaylistScraperService } from './playlist-scraper.service.js';
import { SpotifyPlaylistScraper } from './spotify-playlist-scraper.service.js';

@Module({
    imports: [TrackModule, TrackScraperModule],
    controllers: [],
    providers: [
        MelonPlaylistScraper,
        FloPlaylistScraper,
        SpotifyPlaylistScraper,
        PlaylistScraperService,
        AuthdataService,
        PrismaService,
        VendorPlaylistRepository,
    ],
    exports: [PlaylistScraperService, MelonPlaylistScraper, FloPlaylistScraper, SpotifyPlaylistScraper],
})
export class PlaylistScraperModule {}
