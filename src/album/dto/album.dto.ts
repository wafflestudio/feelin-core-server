import { IsULID } from '@/validation/ulid.validator.js';
import { IsUrl } from 'class-validator';

export class AlbumDto {
    @IsULID()
    id!: string;

    title!: string;

    @IsUrl()
    thumbnail!: string;

    constructor(id: string, title: string, thumbnail: string) {
        this.id = id;
        this.title = title;
        this.thumbnail = thumbnail;
    }
}
