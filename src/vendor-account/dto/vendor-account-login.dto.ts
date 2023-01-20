import { IsString } from 'class-validator';

export class VendorAccountLoginDto {
    @IsString()
    accessToken!: string;

    @IsString()
    refreshToken: string;

    @IsString()
    id!: string;
}
