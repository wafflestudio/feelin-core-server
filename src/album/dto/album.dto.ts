import { IsUUID, IsUrl } from 'class-validator';

export class AlbumDto {
    @IsUUID()
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
