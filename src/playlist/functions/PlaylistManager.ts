import { AuthData } from 'src/types';
import { Playlist } from '../playlist.entity';

abstract class PlaylistManager {
    async savePlaylist(playlist: Playlist, authData: AuthData) {}

    async getPlaylist(playlistId: string): Promise<Playlist> {
        return new Playlist();
    }
}

export default PlaylistManager;
