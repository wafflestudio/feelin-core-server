import { BaseTimeEntity } from '@/dao/base-time.entity.js';
import { Vendors } from '@feelin-types/types.js';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Album } from './album.entity.js';

@Entity()
@Unique('STREAM_ALBUM_ID', ['vendorId', 'vendor'])
export class VendorAlbum extends BaseTimeEntity {
    @Column({ name: 'vendor' })
    vendor!: Vendors;

    @Column({ name: 'vendor_id' })
    vendorId!: string;

    @ManyToOne(() => Album)
    @JoinColumn({ name: 'album' })
    album!: Album;
}
