import { Album } from '@/album/album.entity.js';
import { Artist } from '@/artist/artist.entity.js';
import { Playlist } from '@/playlist/playlist.entity.js';
import {
    BaseEntity,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    Relation,
} from 'typeorm';

@Entity()
export class Track extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @ManyToMany(() => Playlist, (playlist) => playlist.id)
    playlists: Playlist[];

    @ManyToMany(() => Artist, (artist) => artist.id)
    @JoinTable()
    artists!: Artist[];

    @ManyToOne(() => Album)
    album!: Relation<Album>;
}
