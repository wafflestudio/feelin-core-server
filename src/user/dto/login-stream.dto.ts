import { IsString } from 'class-validator';
import { Vendors } from '@feelin-types/types.js';

export class LoginStreamDto {
    @IsString()
    vendor!: Vendors;

    @IsString()
    id!: string;

    @IsString()
    password!: string;
}
