import { BaseTimeEntity } from '@/dao/base-time.entity.js';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Artist } from '../../artist/entity/artist.entity.js';
import { Track } from './track.entity.js';

@Entity()
export class TrackArtist extends BaseTimeEntity {
    @ManyToOne(() => Track)
    @JoinColumn({ name: 'track' })
    track!: Track;

    @ManyToOne(() => Artist)
    @JoinColumn({ name: 'artist' })
    artist!: Artist;
}
