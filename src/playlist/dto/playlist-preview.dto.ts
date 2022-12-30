import { IsUUID, IsUrl } from 'class-validator';

export class PlaylistPreviewDto {
    @IsUUID()
    id!: string;

    @IsUrl()
    thumbnail!: string;

    constructor(id: string, thumbnail: string) {
        this.id = id;
        this.thumbnail = thumbnail;
    }
}
