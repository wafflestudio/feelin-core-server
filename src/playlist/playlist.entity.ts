import { StreamService, StreamServiceEnum } from '@feelin-types/types.js';
import Track from '@track/track.entity.js';

import {
    BaseEntity,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';

@Entity()
class Playlist extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @ManyToMany(() => Track, (track) => track.id)
    @JoinTable()
    tracks!: Track[];
}

@Entity()
@Unique('STREAM_PLAYLIST_ID', ['streamId', 'streamType'])
class StreamPlaylist extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'enum', enum: StreamServiceEnum })
    streamType!: StreamService;

    @Column({ unique: true })
    streamId!: string;

    @ManyToOne(() => Playlist)
    playlist!: Playlist;
}

export { Playlist, StreamPlaylist };
