import { Module } from '@nestjs/common';
import { FloPlaylistScraper } from './flo';
import { MelonPlaylistScraper } from './melon';
import { PlaylistScraperService } from './playlist-scraper.service';

@Module({
    controllers: [],
    providers: [
        MelonPlaylistScraper,
        FloPlaylistScraper,
        PlaylistScraperService,
    ],
    exports: [PlaylistScraperService],
})
export class PlaylistScraperModule {}
