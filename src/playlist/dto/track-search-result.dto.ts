import { IsULID } from '@/validation/ulid.validator.js';

export class TrackSearchResultDto {
    @IsULID()
    id: string;

    vendorId: string;

    title: string;

    album: string;

    artists: string[];
}
