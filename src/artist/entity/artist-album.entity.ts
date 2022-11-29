import { BaseTimeEntity } from '@/dao/base-time.entity.js';
import { Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Album } from '../../album/entity/album.entity.js';
import { Artist } from './artist.entity.js';

@Entity({ name: 'artist_album' })
@Unique('ARTIST_ALBUM', ['artist', 'album'])
export class ArtistAlbum extends BaseTimeEntity {
    @ManyToOne(() => Artist)
    @JoinColumn({ name: 'artist' })
    artist!: Artist;

    @ManyToOne(() => Album)
    @JoinColumn({ name: 'album' })
    album!: Album;
}
