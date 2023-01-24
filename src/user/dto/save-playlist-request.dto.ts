import { IsString } from 'class-validator';

export class SavePlaylistRequestDto {
    @IsString()
    title!: string;

    @IsString()
    description!: string;
}
