import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Album } from '../../album/entity/album.entity.js';

@Entity()
export class Track extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'title' })
    title!: string;

    @ManyToOne(() => Album)
    @JoinColumn({ name: 'album' })
    album!: Album;
}
