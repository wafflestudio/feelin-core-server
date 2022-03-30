import { Playlist } from 'src/playlist/playlist.entity';
import { AuthData, CookieData } from 'src/types';
import PlaylistManager from '../PlaylistManager';
import getPlaylist from './getPlaylist';
import savePlaylist from './savePlaylist';

class MelonPlaylistManager extends PlaylistManager {
    async savePlaylist(playlist: Playlist, authData: AuthData) {
        return savePlaylist(playlist, authData as CookieData);
    }

    async getPlaylist(playlistId: string): Promise<Playlist> {
        return getPlaylist(playlistId);
    }
}

export { MelonPlaylistManager };
