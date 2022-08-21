import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { StreamService, StreamServiceEnum } from '@feelin-types/types.js';

@Entity()
class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    username!: string;
}

@Entity()
class StreamAccount extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    streamType!: StreamService;

    @Column({ type: 'varchar', length: 64 })
    publicKey!: string;

    // TODO: Better data type to save database space
    @Column({ type: 'varchar', length: 2000 })
    privateKey!: string;

    // TODO: Better data type to save database space
    @Column({ type: 'varchar', length: 2000 })
    cookie!: string;

    @ManyToOne(() => User)
    user!: User;

    constructor(streamType: StreamService, cookie: string, publicKey: string, privateKey: string) {
        super();
        this.streamType = streamType;
        this.cookie = cookie;
        this.publicKey = publicKey;
        this.privateKey = privateKey;
    }
}

export { User, StreamAccount };
