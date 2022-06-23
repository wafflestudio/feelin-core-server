import { AuthData } from 'src/types';
import { Playlist } from '../playlist/playlist.entity';

abstract class PlaylistScraper {
    abstract savePlaylist(playlist: Playlist, authData: AuthData); // TODO: define return type
    abstract getPlaylist(playlistId: string): Promise<Playlist>;
}

export default PlaylistScraper;
