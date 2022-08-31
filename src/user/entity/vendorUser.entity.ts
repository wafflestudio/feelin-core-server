import { Vendors } from '@feelin-types/types.js';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity.js';

@Entity()
export class VendorUser extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'vendor' })
    vendor!: Vendors;

    @Column({ name: 'public_key', type: 'varchar', length: 64 })
    publicKey!: string;

    // TODO: Better data type to save database space
    @Column({ name: 'private_key', type: 'varchar', length: 2000 })
    privateKey!: string;

    // TODO: Better data type to save database space
    @Column({ name: 'cookie', type: 'varchar', length: 2000 })
    cookie!: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user' })
    user!: User;
}
