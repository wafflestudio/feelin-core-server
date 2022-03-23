import { Playlist } from 'src/playlist/playlist.entity';
import { AuthData, JwtTokenPair } from 'src/types';
import PlaylistManager from '../PlaylistManager';
import getPlaylist from './getPlaylist';
import savePlaylist from './savePlaylist';

class FloPlaylistManager extends PlaylistManager {
    async savePlaylist(playlist: Playlist, authData: AuthData) {
        return savePlaylist(playlist, authData as JwtTokenPair);
    }

    async getPlaylist(playlistId: string): Promise<Playlist> {
        return getPlaylist(playlistId);
    }
}

export { FloPlaylistManager };
