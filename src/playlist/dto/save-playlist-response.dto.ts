import { IsUrl } from 'class-validator';

export class SavePlaylistResponseDto {
    @IsUrl()
    url!: string;

    constructor(url: string) {
        this.url = url;
    }
}
