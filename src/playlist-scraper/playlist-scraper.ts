import { Authdata } from '@/authdata/types.js';
import { IPlaylist } from '@/playlist/types/types.js';
import { SavePlaylistRequestDto } from '@/user/dto/save-playlist-request.dto.js';
import { Track } from '@prisma/client';

export interface PlaylistScraper {
    savePlaylist(request: SavePlaylistRequestDto, tracks: Track[], authdata: Authdata): Promise<void>;
    getPlaylist(playlistId: string, authdata: Authdata): Promise<IPlaylist>;
}
