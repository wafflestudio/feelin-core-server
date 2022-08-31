import { Vendors } from '@feelin-types/types.js';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Track } from './track.entity.js';

@Entity()
@Unique('STREAM_TRACK_ID', ['vendorId', 'vendor'])
export class VendorTrack extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'vendor' })
    vendor!: Vendors;

    @Column({ name: 'vendor_id', unique: true })
    vendorId!: string;

    @ManyToOne(() => Track)
    @JoinColumn({ name: 'track' })
    track!: Track;
}
