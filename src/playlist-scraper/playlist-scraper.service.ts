import { Injectable } from '@nestjs/common';
import { StreamService } from '@feelin-types/types.js';
import { FloPlaylistScraper } from './flo/index.js';
import getStreamAndId from './getStreamAndId.js';
import MelonPlaylistScraper from './melon/index.js';
import PlaylistScraper from './PlaylistScraper.js';

@Injectable()
export class PlaylistScraperService {
    playlistScrapers: { [key in StreamService]: PlaylistScraper };

    constructor(
        private readonly melonPlaylistScraper: MelonPlaylistScraper,
        private readonly floPlaylistScraper: FloPlaylistScraper,
    ) {
        this.playlistScrapers = {
            melon: melonPlaylistScraper,
            flo: floPlaylistScraper,
        };
    }

    get(streamType: StreamService): PlaylistScraper {
        return this.playlistScrapers[streamType];
    }

    async getStreamAndId(playlistUrl: string): Promise<{
        streamType: StreamService;
        playlistId: string;
    }> {
        return getStreamAndId(playlistUrl);
    }
}
