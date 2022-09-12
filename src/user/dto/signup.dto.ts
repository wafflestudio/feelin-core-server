import { IsString, IsUUID } from 'class-validator';

export class SignUpDto {
    @IsUUID()
    id!: string;

    @IsString()
    username!: string;
}
