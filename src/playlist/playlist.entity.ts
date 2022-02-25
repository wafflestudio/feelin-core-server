import { Track } from 'src/track/track.entity';

import {
    BaseEntity,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { StreamService, StreamServiceEnum } from 'src/types';

@Entity()
class StreamPlaylist extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'enum', enum: StreamServiceEnum })
    streamType!: StreamService;

    url!: string;
}

@Entity()
class Playlist extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    description!: string;

    @ManyToMany(() => Track, (track) => track.id, {
        cascade: true,
    })
    @JoinTable()
    tracks!: Track[];

    @OneToMany(() => StreamPlaylist, (playlist) => playlist.id)
    streamPlaylists!: StreamPlaylist[];
}

export { Playlist, StreamPlaylist };
