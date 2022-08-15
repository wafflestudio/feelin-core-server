import { Authdata } from '@/authdata/types.js';
import { Playlist } from '@/playlist/playlist.entity.js';

export interface PlaylistScraper {
    savePlaylist(playlist: Playlist, authdata: Authdata); // TODO: define return type
    getPlaylist(playlistId: string): Promise<Playlist>;
}
