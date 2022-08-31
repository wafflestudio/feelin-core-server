import { BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Album } from '../../album/entity/album.entity.js';
import { Artist } from './artist.entity.js';

@Entity()
@Unique('ARTIST_ALBUM', ['artist', 'album'])
export class ArtistAlbum extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Artist)
    @JoinColumn({ name: 'artist' })
    artist!: Artist;

    @ManyToOne(() => Album)
    @JoinColumn({ name: 'album' })
    album!: Album;
}
