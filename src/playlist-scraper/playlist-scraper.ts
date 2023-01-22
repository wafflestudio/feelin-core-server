import { IPlaylist } from '@/playlist/types/types.js';
import { SavePlaylistRequestDto } from '@/user/dto/save-playlist-request.dto.js';
import { Authdata } from '@/vendor-account/dto/decrypted-vendor-account.dto.js';
import { Track } from '@prisma/client';

export interface PlaylistScraper {
    savePlaylist(request: SavePlaylistRequestDto, tracks: Track[], authdata: Authdata): Promise<void>;
    getPlaylist(playlistId: string, authdata: Authdata): Promise<IPlaylist>;
}
