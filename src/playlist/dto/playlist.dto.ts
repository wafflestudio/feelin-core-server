import { TrackDto } from '@/track/dto/track.dto.js';
import { IsUUID } from 'class-validator';
import { PlaylistPreviewDto } from './playlist-preview.dto.js';
import { VendorPlaylistDto } from './vendor-playlist.dto.js';

export class PlaylistDto {
    @IsUUID()
    id!: string;

    title!: string;

    tracks!: TrackDto[];

    originalVendorPlaylist!: VendorPlaylistDto;

    preview!: PlaylistPreviewDto;

    constructor(
        id: string,
        title: string,
        tracks: TrackDto[],
        originalVendorPlaylist: VendorPlaylistDto,
        preview: PlaylistPreviewDto,
    ) {
        this.id = id;
        this.title = title;
        this.tracks = tracks;
        this.originalVendorPlaylist = originalVendorPlaylist;
        this.preview = preview;
    }
}
