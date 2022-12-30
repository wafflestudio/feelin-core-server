import { IsString, IsUUID } from 'class-validator';

export class UserDto {
    @IsUUID()
    id!: string;

    @IsString()
    username!: string;

    constructor(id: string, username: string) {
        this.id = id;
        this.username = username;
    }
}
