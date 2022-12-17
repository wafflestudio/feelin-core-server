import { Authdata } from '@/authdata/types.js';
import { IPlaylist } from '@/playlist/types/types.js';
import { SavePlaylistRequestDto } from '@/user/dto/save-playlist-request.dto.js';
import { Injectable } from '@nestjs/common';
import { Track } from '@prisma/client';
import { PlaylistScraper } from './playlist-scraper.js';

@Injectable()
export class SpotifyPlaylistScraper implements PlaylistScraper {
    savePlaylist(request: SavePlaylistRequestDto, tracks: Track[], authdata: Authdata): Promise<void> {
        throw new Error('Method not implemented.');
    }

    getPlaylist(playlistId: string): Promise<IPlaylist> {
        throw new Error('Method not implemented.');
    }
}
