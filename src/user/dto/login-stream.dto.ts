import { IsString } from 'class-validator';
import { StreamService } from 'src/types';

export class LoginStreamDto {
    @IsString()
    streamType!: StreamService;

    @IsString()
    id!: string;

    @IsString()
    password!: string;
}
