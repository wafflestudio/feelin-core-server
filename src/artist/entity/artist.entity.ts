import { BaseTimeEntity } from '@/dao/base-time.entity.js';
import { Column, Entity } from 'typeorm';

@Entity()
export class Artist extends BaseTimeEntity {
    @Column({ name: 'name', type: 'varchar', length: 200 })
    name!: string;
}
