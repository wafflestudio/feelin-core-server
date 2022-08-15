import { StreamService, StreamServiceEnum } from '@feelin-types/types.js';
import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import Album from './album.entity.js';

@Entity()
@Unique('STREAM_ALBUM_ID', ['streamId', 'streamType'])
export default class StreamAlbum extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    streamType!: StreamService;

    @Column({ unique: true })
    streamId!: string;

    @ManyToOne(() => Album)
    album!: Album;
}
