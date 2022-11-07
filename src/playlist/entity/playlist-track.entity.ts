import { BaseTimeEntity } from '@/dao/base-time.entity.js';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Track } from '../../track/entity/track.entity.js';
import { Playlist } from './playlist.entity.js';

@Entity()
export class PlaylistTrack extends BaseTimeEntity {
    @ManyToOne(() => Playlist)
    @JoinColumn({ name: 'playlist' })
    playlist!: Playlist;

    @ManyToOne(() => Track)
    @JoinColumn({ name: 'track' })
    track!: Track;
}
