import { StreamService, StreamServiceEnum } from '@feelin-types/types.js';
import Track from '@track/track.entity.js';
import {
    BaseEntity,
    Column,
    Entity,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';

@Entity()
class Artist extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @ManyToMany(() => Track, (track) => track.id)
    tracks!: Track[];
}

@Entity()
@Unique('STREAM_ARTIST_ID', ['streamId', 'streamType'])
class StreamArtist extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'enum', enum: StreamServiceEnum })
    streamType!: StreamService;

    @Column({ unique: true })
    streamId!: string;

    @ManyToOne(() => Artist)
    artist!: Artist;
}

export { Artist, StreamArtist };
