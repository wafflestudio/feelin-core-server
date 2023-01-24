import { VendorPlaylistRepository } from '@/playlist/vendor-playlist.repository.js';
import { PrismaService } from '@/prisma.service.js';
import { TrackScraperModule } from '@/track-scraper/track-scraper.module.js';
import { TrackModule } from '@/track/track.module.js';
import { UserScraperModule } from '@/user-scraper/user-scraper.module.js';
import { Module } from '@nestjs/common';
import { AppleMusicPlaylistScraper } from './applemusic-playlist-scraper.service.js';
import { FloPlaylistScraper } from './flo-playlist-scraper.service.js';
import { MelonPlaylistScraper } from './melon-playlist-scraper.service.js';
import { PlaylistScraperService } from './playlist-scraper.service.js';
import { SpotifyPlaylistScraper } from './spotify-playlist-scraper.service.js';

@Module({
    imports: [TrackModule, TrackScraperModule, UserScraperModule],
    controllers: [],
    providers: [
        MelonPlaylistScraper,
        FloPlaylistScraper,
        SpotifyPlaylistScraper,
        AppleMusicPlaylistScraper,
        PlaylistScraperService,
        PrismaService,
        VendorPlaylistRepository,
    ],
    exports: [
        PlaylistScraperService,
        MelonPlaylistScraper,
        FloPlaylistScraper,
        SpotifyPlaylistScraper,
        AppleMusicPlaylistScraper,
    ],
})
export class PlaylistScraperModule {}
