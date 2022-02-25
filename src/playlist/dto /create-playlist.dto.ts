import { IsUrl } from 'class-validator';
import { StreamService } from 'src/types';

export class createPlaylistDto {
    type!: StreamService;

    @IsUrl()
    url!: string;
}
