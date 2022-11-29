import { BaseTimeEntity } from '@/dao/base-time.entity.js';
import { Vendors } from '@feelin-types/types.js';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Track } from './track.entity.js';

@Entity()
@Unique('STREAM_TRACK_ID', ['vendorId', 'vendor'])
export class VendorTrack extends BaseTimeEntity {
    @Column({ name: 'vendor' })
    vendor!: Vendors;

    @Column({ name: 'vendor_id', unique: true })
    vendorId!: string;

    @ManyToOne(() => Track)
    @JoinColumn({ name: 'track' })
    track!: Track;
}
