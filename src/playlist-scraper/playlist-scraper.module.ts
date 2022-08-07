import { AuthdataService } from '@authdata/authdata.service.js';
import { Module } from '@nestjs/common';
import MelonTrackScraper from '@track-scraper/melon/index.js';
import { TrackModule } from '@track/track.module.js';
import { FloPlaylistScraper } from './flo/index.js';
import MelonPlaylistScraper from './melon/index.js';
import { PlaylistScraperService } from './playlist-scraper.service.js';

@Module({
    imports: [TrackModule],
    controllers: [],
    providers: [
        MelonPlaylistScraper,
        MelonTrackScraper,
        FloPlaylistScraper,
        PlaylistScraperService,
        AuthdataService,
    ],
    exports: [PlaylistScraperService, MelonPlaylistScraper, FloPlaylistScraper],
})
export class PlaylistScraperModule {}
