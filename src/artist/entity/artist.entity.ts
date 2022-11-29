import { BaseTimeEntity } from '@/dao/base-time.entity.js';
import { Track } from '@/track/entity/track.entity.js';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity()
export class Artist extends BaseTimeEntity {
    @Column({ name: 'name', type: 'varchar', length: 200 })
    name!: string;

    @ManyToMany(() => Track, (track) => track.artists, { lazy: true })
    @JoinTable({
        name: 'track_artist',
        joinColumn: { name: 'artist_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'track_id', referencedColumnName: 'id' },
    })
    tracks!: Track[];
}
