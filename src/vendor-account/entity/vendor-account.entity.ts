import { Vendors } from '@feelin-types/types.js';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity.js';

@Entity()
export class VendorAccount extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user' })
    user!: User;

    @Column({ name: 'vendor' })
    vendor!: Vendors;

    @Column({ name: 'encryption_key', type: 'binary', length: 32 })
    encryptionKey!: Buffer;

    @Column({ name: 'is_active', type: 'boolean', default: true })
    isActive!: boolean;
}
