import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { StreamService, StreamServiceEnum } from 'src/types';

@Entity()
class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    username!: string;

    @OneToMany(() => StreamAccount, (account) => account.user)
    streamAccounts: StreamAccount[];
}

@Entity()
class StreamAccount extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'enum', enum: StreamServiceEnum })
    streamType!: StreamService;

    @Column({ type: 'char', length: 64 })
    publicKey!: string;

    // TODO: Better data type to save database space
    @Column({ type: 'varchar', length: 2000 })
    privateKey!: string;

    // TODO: Better data type to save database space
    @Column({ type: 'varchar', length: 2000 })
    cookie!: string;

    @ManyToOne(() => User, (user) => user.streamAccounts)
    user!: User;

    constructor(
        streamType: StreamService,
        cookie: string,
        publicKey: string,
        privateKey: string,
    ) {
        super();
        this.streamType = streamType;
        this.cookie = cookie;
        this.publicKey = publicKey;
        this.privateKey = privateKey;
    }
}

export { User, StreamAccount };
