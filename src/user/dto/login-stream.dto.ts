import { IsULID } from '@/validation/ulid.validator.js';
import { Vendors } from '@feelin-types/types.js';
import { IsString } from 'class-validator';

export class LoginStreamRequestDto {
    @IsString()
    vendor!: Vendors;

    @IsString()
    id!: string;

    @IsString()
    password!: string;
}

export class LoginStreamResponseDto {
    @IsULID()
    id!: string;

    @IsString()
    encryptedAuthData!: string;

    constructor(id: string, encryptedAuthData: string) {
        this.id = id;
        this.encryptedAuthData = encryptedAuthData;
    }
}
