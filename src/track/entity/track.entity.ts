import { BaseTimeEntity } from '@/dao/base-time.entity.js';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Album } from '../../album/entity/album.entity.js';

@Entity()
export class Track extends BaseTimeEntity {
    @Column({ name: 'title' })
    title!: string;

    @ManyToOne(() => Album)
    @JoinColumn({ name: 'album' })
    album!: Album;
}
