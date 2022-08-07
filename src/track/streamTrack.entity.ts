import { StreamService, StreamServiceEnum } from '@feelin-types/types.js';
import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import Track from './track.entity.js';

@Entity()
@Unique('STREAM_TRACK_ID', ['streamId', 'streamType'])
export default class StreamTrack extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'enum', enum: StreamServiceEnum })
    streamType!: StreamService;

    @Column({ unique: true })
    streamId!: string;

    @ManyToOne(() => Track)
    track!: Track;
}
