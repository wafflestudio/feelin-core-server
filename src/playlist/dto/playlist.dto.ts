import { TrackDto } from '@/track/dto/track.dto.js';
import { IsULID } from '@/validation/ulid.validator.js';
import { PlaylistPreviewDto } from './playlist-preview.dto.js';

export class PlaylistDto {
    @IsULID()
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
