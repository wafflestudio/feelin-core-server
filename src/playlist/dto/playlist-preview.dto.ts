import { IsULID } from '@/validation/ulid.validator.js';
import { IsUrl } from 'class-validator';

export class PlaylistPreviewDto {
    @IsULID()
    id!: string;

    @IsUrl()
    thumbnail!: string;

    constructor(id: string, thumbnail: string) {
        this.id = id;
        this.thumbnail = thumbnail;
    }
}
