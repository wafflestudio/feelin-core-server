import { BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Playlist } from './playlist.entity.js';
import { Track } from '../../track/entity/track.entity.js';

@Entity()
export class PlaylistTrack extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Playlist)
    @JoinColumn({ name: 'playlist' })
    playlist!: Playlist;

    @ManyToOne(() => Track)
    @JoinColumn({ name: 'track' })
    track!: Track;
}
