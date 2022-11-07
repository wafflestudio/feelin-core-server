import { BaseTimeEntity } from '@/dao/base-time.entity.js';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends BaseTimeEntity {
    @Column({ name: 'username', type: 'varchar', length: 50 })
    username!: string;
}
