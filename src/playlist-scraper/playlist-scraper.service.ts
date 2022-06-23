import { Injectable } from '@nestjs/common';
import { StreamService } from 'src/types';
import { FloPlaylistScraper } from './flo';
import getStreamAndId from './getStreamAndId';
import { MelonPlaylistScraper } from './melon';
import PlaylistScraper from './PlaylistScraper';

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
