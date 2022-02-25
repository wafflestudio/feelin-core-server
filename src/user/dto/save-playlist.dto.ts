import { IsString } from 'class-validator';
import { StreamService } from 'src/types';

export class savePlaylistDto {
    @IsString()
    symmKey: string;

    @IsString()
    publicKey: string;
}
