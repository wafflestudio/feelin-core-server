import { IsUrl } from 'class-validator';

export class CreatePlaylistDto {
    @IsUrl()
    playlistUrl!: string;
}
