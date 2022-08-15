import Track from '@/track/track.entity.js';

import {
    BaseEntity,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class Playlist extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @ManyToMany(() => Track, (track) => track.id)
    @JoinTable()
    tracks!: Track[];
}
