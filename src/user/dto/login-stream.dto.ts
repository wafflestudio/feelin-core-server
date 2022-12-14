import { Vendors } from '@feelin-types/types.js';
import { IsString, IsUUID } from 'class-validator';

export class LoginStreamRequestDto {
    @IsString()
    vendor!: Vendors;

    @IsString()
    id!: string;

    @IsString()
    password!: string;
}

export class LoginStreamResponseDto {
    @IsUUID()
    id!: string;

    @IsString()
    encryptedAuthData!: string;

    constructor(id: string, encryptedAuthData: string) {
        this.id = id;
        this.encryptedAuthData = encryptedAuthData;
    }
}
