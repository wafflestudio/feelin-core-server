import { Vendors } from '@feelin-types/types.js';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Artist } from './artist.entity.js';

@Entity()
@Unique('STREAM_ARTIST_ID', ['vendorId', 'vendor'])
export class VendorArtist extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'vendor' })
    vendor!: Vendors;

    @Column({ name: 'vendor_id' })
    vendorId!: string;

    @ManyToOne(() => Artist)
    @JoinColumn({ name: 'artist' })
    artist!: Artist;
}
