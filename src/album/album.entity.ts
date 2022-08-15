import Artist from '@/artist/artist.entity.js';
import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class Album extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    // @Column()
    // description!: string;

    @Column({ type: 'datetime' })
    realeaseDate!: Date;

    @ManyToOne(() => Artist)
    artist!: Artist;
}
