import { BaseTimeEntity } from '@/dao/base-time.entity.js';
import { Vendors } from '@feelin-types/types.js';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Artist } from './artist.entity.js';

@Entity()
@Unique('STREAM_ARTIST_ID', ['vendorId', 'vendor'])
export class VendorArtist extends BaseTimeEntity {
    @Column({ name: 'vendor' })
    vendor!: Vendors;

    @Column({ name: 'vendor_id' })
    vendorId!: string;

    @ManyToOne(() => Artist)
    @JoinColumn({ name: 'artist' })
    artist!: Artist;
}
