import { IsString } from 'class-validator';
import { StreamService } from 'src/types';

export class loginStreamDto {
    @IsString()
    streamType!: StreamService;

    @IsString()
    id!: string;

    @IsString()
    password!: string;
}
