import { BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Artist } from '../../artist/entity/artist.entity.js';
import { Track } from './track.entity.js';

@Entity()
export class TrackArtist extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Track)
    @JoinColumn({ name: 'track' })
    track!: Track;

    @ManyToOne(() => Artist)
    @JoinColumn({ name: 'artist' })
    artist!: Artist;
}
