import { Injectable } from '@nestjs/common';
import { Playlist } from 'src/playlist/playlist.entity';
import { AuthData, CookieData } from 'src/types';
import PlaylistScraper from '../PlaylistScraper';
import getPlaylist from './getPlaylist';
import savePlaylist from './savePlaylist';

@Injectable()
class MelonPlaylistScraper extends PlaylistScraper {
    async savePlaylist(playlist: Playlist, authData: AuthData) {
        return savePlaylist(playlist, authData as CookieData);
    }

    async getPlaylist(playlistId: string): Promise<Playlist> {
        return getPlaylist(playlistId);
    }
}

export { MelonPlaylistScraper };
