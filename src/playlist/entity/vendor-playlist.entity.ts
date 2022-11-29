import { BaseTimeEntity } from '@/dao/base-time.entity.js';
import { Vendors } from '@feelin-types/types.js';

import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Playlist } from './playlist.entity.js';

@Entity()
@Unique('STREAM_PLAYLIST_ID', ['vendorId', 'vendor'])
export class VendorPlaylist extends BaseTimeEntity {
    @Column({ name: 'vendor' })
    vendor!: Vendors;

    @Column({ name: 'vendor_id', unique: true })
    vendorId!: string;

    @ManyToOne(() => Playlist)
    @JoinColumn({ name: 'playlist' })
    playlist!: Playlist;
}
