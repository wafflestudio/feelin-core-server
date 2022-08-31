import { Vendors } from '@feelin-types/types.js';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Album } from './album.entity.js';

@Entity()
@Unique('STREAM_ALBUM_ID', ['vendorId', 'vendor'])
export class VendorAlbum extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'vendor' })
    vendor!: Vendors;

    @Column({ name: 'vendor_id' })
    vendorId!: string;

    @ManyToOne(() => Album)
    @JoinColumn({ name: 'album' })
    album!: Album;
}
