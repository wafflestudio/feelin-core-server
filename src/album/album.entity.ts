import { Artist } from '@artist/artist.entity.js';
import { StreamService, StreamServiceEnum } from '@feelin-types/types.js';
import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';

@Entity()
class Album extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    // @Column()
    // description!: string;

    @Column({ type: 'datetime' })
    realeaseDate!: Date;

    @ManyToOne(() => Artist)
    artist!: Artist;
}

@Entity()
@Unique('STREAM_ALBUM_ID', ['streamId', 'streamType'])
class StreamAlbum extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'enum', enum: StreamServiceEnum })
    streamType!: StreamService;

    @Column({ unique: true })
    streamId!: string;

    @ManyToOne(() => Album)
    album!: Album;
}

export { Album, StreamAlbum };
