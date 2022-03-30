import { Track } from 'src/track/track.entity';

import {
    BaseEntity,
    Column,
    Entity,
    Index,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { StreamService, StreamServiceEnum } from 'src/types';

@Entity()
class Playlist extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column({ nullable: false, default: '' })
    description: string;

    @ManyToMany(() => Track, (track) => track.id, {
        cascade: true,
    })
    @JoinTable()
    tracks!: Track[];

    @OneToMany(() => StreamPlaylist, (playlist) => playlist.id)
    streamPlaylists!: StreamPlaylist[];
}

@Entity()
@Index(['streamId', 'streamType'])
class StreamPlaylist extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'enum', enum: StreamServiceEnum })
    streamType!: StreamService;

    @Column({ unique: true })
    streamId!: string;

    @ManyToOne(() => Playlist, (playlist) => playlist.streamPlaylists)
    playlist!: Playlist;
}

export { Playlist, StreamPlaylist };
