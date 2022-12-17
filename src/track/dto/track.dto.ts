import { AlbumDto } from '@/album/dto/album.dto.js';
import { ArtistDto } from '@/artist/dto/artist.dto.js';
import { IsULID } from '@/validation/ulid.validator.js';

export class TrackDto {
    @IsULID()
    id!: string;

    title!: string;

    artists: ArtistDto[];

    album!: AlbumDto;

    constructor(id: string, title: string, artists: ArtistDto[], album: AlbumDto) {
        this.id = id;
        this.title = title;
        this.artists = artists;
        this.album = album;
    }
}
