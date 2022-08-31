import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Album extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'title', type: 'varchar', length: 200 })
    title!: string;

    @Column({ name: 'description', type: 'varchar', length: 500, nullable: true })
    description!: string;

    @Column({ name: 'release_date', type: 'datetime', nullable: true })
    releaseDate!: Date;
}
