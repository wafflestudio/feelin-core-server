import { StreamService, StreamServiceEnum } from '@feelin-types/types.js';
import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { Artist } from './artist.entity.js';

@Entity()
@Unique('STREAM_ARTIST_ID', ['streamId', 'streamType'])
export class StreamArtist extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    streamType!: StreamService;

    @Column({ unique: true })
    streamId!: string;

    @ManyToOne(() => Artist)
    artist!: Artist;
}
