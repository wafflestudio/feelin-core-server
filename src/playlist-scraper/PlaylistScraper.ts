import { Authdata } from '@/authdata/types.js';
import { Playlist } from '@/playlist/entity/playlist.entity.js';
import { IPlaylist } from '@/playlist/types/types';
import { Track } from '@/track/entity/track.entity.js';

export interface PlaylistScraper {
    savePlaylist(playlist: Playlist, tracks: Track[], authdata: Authdata); // TODO: define return type
    getPlaylist(playlistId: string): Promise<IPlaylist>;
}
