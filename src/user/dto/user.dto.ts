import { IsULID } from '@/validation/ulid.validator.js';
import { IsString } from 'class-validator';

export class UserDto {
    @IsULID()
    id!: string;

    @IsString()
    username!: string;

    constructor(id: string, username: string) {
        this.id = id;
        this.username = username;
    }
}
