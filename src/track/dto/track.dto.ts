import { AlbumDto } from '@/album/dto/album.dto.js';
import { ArtistDto } from '@/artist/dto/artist.dto.js';
import { IsUUID } from 'class-validator';

export class TrackDto {
    @IsUUID()
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
