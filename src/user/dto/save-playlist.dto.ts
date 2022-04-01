import { IsString } from 'class-validator';

export class SavePlaylistDto {
    @IsString()
    symmKey: string;

    @IsString()
    publicKey: string;
}
