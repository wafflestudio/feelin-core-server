import { StreamService, StreamServiceEnum } from '@feelin-types/types.js';
import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { Track } from './track.entity.js';

@Entity()
@Unique('STREAM_TRACK_ID', ['streamId', 'streamType'])
export class StreamTrack extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    streamType!: StreamService;

    @Column({ unique: true })
    streamId!: string;

    @ManyToOne(() => Track)
    track!: Track;
}
