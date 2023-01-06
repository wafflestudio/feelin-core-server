import { TrackDto } from '@/track/dto/track.dto.js';
import { IsUUID } from 'class-validator';
import { PlaylistPreviewDto } from './playlist-preview.dto.js';

export class PlaylistDto {
    @IsUUID()
    id!: string;

    title!: string;

    tracks!: TrackDto[];

    preview!: PlaylistPreviewDto;

    constructor(id: string, title: string, tracks: TrackDto[], preview: PlaylistPreviewDto) {
        this.id = id;
        this.title = title;
        this.tracks = tracks;
        this.preview = preview;
    }
}
