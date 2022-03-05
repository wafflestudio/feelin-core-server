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

    @OneToMany(() => StreamAccount, (account) => account.user, {
        cascade: true,
    })
    streamAccounts: StreamAccount[];
}

@Entity()
class StreamAccount extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'enum', enum: StreamServiceEnum })
    streamType!: StreamService;

    @Column()
    publicKey!: string;

    @Column({ unique: true })
    privateKey!: string;

    @Column()
    cookie!: string;

    @ManyToOne(() => User, (user) => user.streamAccounts)
    user: User;

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