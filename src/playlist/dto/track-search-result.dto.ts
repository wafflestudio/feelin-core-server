import { IsUUID } from 'class-validator';

export class TrackSearchResultDto {
    @IsUUID()
    id: string;

    vendorId: string;

    title: string;

    album: string;

    artists: string[];
}
