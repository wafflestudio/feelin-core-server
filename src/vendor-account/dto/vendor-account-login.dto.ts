import { IsOptional, IsString } from 'class-validator';

export class VendorAccountLoginDto {
    @IsString()
    accessToken!: string;

    @IsString()
    @IsOptional()
    refreshToken: string;

    @IsString()
    id!: string;
}
