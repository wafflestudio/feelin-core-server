import { BaseTimeEntity } from '@/dao/base-time.entity.js';
import { Column, Entity } from 'typeorm';

@Entity()
export class Album extends BaseTimeEntity {
    @Column({ name: 'title', type: 'varchar', length: 200 })
    title!: string;

    @Column({ name: 'coverUrl', type: 'varchar', length: 400 })
    coverUrl!: string;

    @Column({ name: 'description', type: 'varchar', length: 500, nullable: true })
    description: string;

    @Column({ name: 'release_date', type: 'datetime', nullable: true })
    releaseDate: Date;
}
