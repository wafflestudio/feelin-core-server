import { StreamService, StreamServiceEnum } from '@feelin-types/types.js';

import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Playlist } from './playlist.entity.js';

@Entity()
@Unique('STREAM_PLAYLIST_ID', ['streamId', 'streamType'])
export class StreamPlaylist extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    streamType!: StreamService;

    @Column({ unique: true })
    streamId!: string;

    @ManyToOne(() => Playlist)
    playlist!: Playlist;
}
