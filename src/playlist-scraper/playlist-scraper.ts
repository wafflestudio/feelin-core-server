import { VendorPlaylistDto } from '@/playlist/dto/vendor-playlist.dto.js';
import { PlaylistInfo } from '@/playlist/types/types.js';
import { SavePlaylistRequestDto } from '@/user/dto/save-playlist-request.dto.js';
import { Authdata } from '@/vendor-account/dto/decrypted-vendor-account.dto.js';
import { VendorPlaylist, VendorTrack } from '@prisma/client';

export interface PlaylistScraper {
    savePlaylist(request: SavePlaylistRequestDto, tracks: VendorTrack[], authdata: Authdata): Promise<string>;
    getPlaylist(playlistId: string, adminToken: string, authdata: Authdata): Promise<PlaylistInfo>;
    getVendorPlaylistDto(vendorPlaylist: VendorPlaylist): VendorPlaylistDto;
}
