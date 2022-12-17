import { IsULID } from '@/validation/ulid.validator.js';
import { IsString } from 'class-validator';

export class SignUpDto {
    @IsULID()
    id!: string;

    @IsString()
    username!: string;
}
