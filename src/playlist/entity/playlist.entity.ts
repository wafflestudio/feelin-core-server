import { BaseTimeEntity } from '@/dao/base-time.entity.js';
import { Track } from '@/track/entity/track.entity.js';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity()
export class Playlist extends BaseTimeEntity {
    @Column({ name: 'title', type: 'varchar', length: 200 })
    title!: string;

    @ManyToMany(() => Track, { lazy: true })
    @JoinTable({
        name: 'playlist_track',
        joinColumn: { name: 'playlist_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'track_id', referencedColumnName: 'id' },
    })
    tracks!: Track[];
}
