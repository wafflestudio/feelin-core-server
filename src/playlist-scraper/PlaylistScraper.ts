import { Authdata } from '@/authdata/types.js';
import { IPlaylist } from '@/playlist/types/types';
import { Track } from '@/track/entity/track.entity.js';
import { SavePlaylistRequestDto } from '@/user/dto/save-playlist-request.dto';

export interface PlaylistScraper {
    savePlaylist(request: SavePlaylistRequestDto, tracks: Track[], authdata: Authdata): Promise<void>;
    getPlaylist(playlistId: string): Promise<IPlaylist>;
}
