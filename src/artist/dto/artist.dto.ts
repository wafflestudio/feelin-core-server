import { IsULID } from '@/validation/ulid.validator.js';

export class ArtistDto {
    @IsULID()
    id!: string;

    name!: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}
