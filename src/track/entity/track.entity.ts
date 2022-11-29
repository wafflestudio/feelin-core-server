import { Artist } from '@/artist/entity/artist.entity.js';
import { BaseTimeEntity } from '@/dao/base-time.entity.js';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Album } from '../../album/entity/album.entity.js';

@Entity()
export class Track extends BaseTimeEntity {
    @Column({ name: 'title' })
    title!: string;

    @ManyToMany(() => Artist, (artist) => artist.tracks, { lazy: true })
    @JoinTable({
        name: 'track_artist',
        joinColumn: { name: 'track_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'artist_id', referencedColumnName: 'id' },
    })
    artists!: Artist[];

    @ManyToOne(() => Album, { lazy: true })
    @JoinColumn({ name: 'album' })
    album!: Album;
}
