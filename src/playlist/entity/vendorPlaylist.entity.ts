import { Vendors } from '@feelin-types/types.js';

import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Playlist } from './playlist.entity.js';

@Entity()
@Unique('STREAM_PLAYLIST_ID', ['vendorId', 'vendor'])
export class VendorPlaylist extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'vendor' })
    vendor!: Vendors;

    @Column({ name: 'vendor_id', unique: true })
    vendorId!: string;

    @ManyToOne(() => Playlist)
    @JoinColumn({ name: 'playlist' })
    playlist!: Playlist;
}
