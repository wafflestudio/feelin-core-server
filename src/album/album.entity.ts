import { Artist } from 'src/artist/artist.entity';
import { Track } from 'src/track/track.entity';
import { StreamService, StreamServiceEnum } from 'src/types';
import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class Album extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    description!: string;

    @Column({ type: 'datetime' })
    realeaseDate!: Date;

    @OneToMany(() => StreamAlbum, (streamTrack) => streamTrack.album, {
        cascade: true,
    })
    streamAlbums!: StreamAlbum[];

    @ManyToOne(() => Artist, (artist) => artist.albums)
    artist!: Artist;

    @OneToMany(() => Track, (track) => track.album)
    tracks!: Track[];
}

@Entity()
class StreamAlbum extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'enum', enum: StreamServiceEnum })
    streamType!: StreamService;

    streamId!: string;

    @ManyToOne(() => Album, (album) => album.streamAlbums)
    album!: Album;
}

export { Album, StreamAlbum };
