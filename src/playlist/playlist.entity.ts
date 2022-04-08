import { Track } from 'src/track/track.entity';

import {
    BaseEntity,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { StreamService, StreamServiceEnum } from 'src/types';

@Entity()
class Playlist extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @ManyToMany(() => Track, (track) => track.id)
    @JoinTable()
    tracks!: Track[];

    @OneToMany(() => StreamPlaylist, (playlist) => playlist.id)
    streamPlaylists!: StreamPlaylist[];
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

    @ManyToOne(() => Playlist, (playlist) => playlist.streamPlaylists)
    playlist!: Playlist;
}

export { Playlist, StreamPlaylist };
