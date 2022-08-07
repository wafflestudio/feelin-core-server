import { IsString } from 'class-validator';
import { StreamService } from '@feelin-types/types.js';

export class LoginStreamDto {
    @IsString()
    streamType!: StreamService;

    @IsString()
    id!: string;

    @IsString()
    password!: string;
}
