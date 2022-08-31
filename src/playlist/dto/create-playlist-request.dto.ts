import { IsUrl } from 'class-validator';

export class CreatePlaylistRequestDto {
    @IsUrl()
    playlistUrl!: string;
}
