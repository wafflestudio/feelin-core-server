import { IsUUID } from 'class-validator';

export class ArtistDto {
    @IsUUID()
    id!: string;

    name!: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}
