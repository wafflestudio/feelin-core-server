import { Playlist } from 'src/playlist/playlist.entity';
import { AuthData, JwtTokenPair } from 'src/types';
import PlaylistScraper from '../PlaylistScraper';
import getPlaylist from './getPlaylist';
import savePlaylist from './savePlaylist';

class FloPlaylistScraper extends PlaylistScraper {
    async savePlaylist(playlist: Playlist, authData: AuthData) {
        return savePlaylist(playlist, authData as JwtTokenPair);
    }

    async getPlaylist(playlistId: string): Promise<Playlist> {
        return getPlaylist(playlistId);
    }
}

export { FloPlaylistScraper };
