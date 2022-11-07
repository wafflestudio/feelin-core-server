import { BaseTimeEntity } from '@/dao/base-time.entity.js';
import { Column, Entity } from 'typeorm';

@Entity()
export class Playlist extends BaseTimeEntity {
    @Column({ name: 'title', type: 'varchar', length: 200 })
    title!: string;
}
