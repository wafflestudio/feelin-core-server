import AuthdataService from '@/authdata/authdata.service.js';
import { TrackScraperModule } from '@/track-scraper/track-scraper.module.js';
import { TrackModule } from '@/track/track.module.js';
import { Module } from '@nestjs/common';
import FloPlaylistScraper from './flo-playlist-scraper.service.js';
import MelonPlaylistScraper from './melon-playlist-scraper.service.js';
import PlaylistScraperService from './playlist-scraper.service.js';

@Module({
    imports: [TrackModule, TrackScraperModule],
    controllers: [],
    providers: [
        MelonPlaylistScraper,
        FloPlaylistScraper,
        PlaylistScraperService,
        AuthdataService,
    ],
    exports: [PlaylistScraperService, MelonPlaylistScraper, FloPlaylistScraper],
})
export class PlaylistScraperModule {}
