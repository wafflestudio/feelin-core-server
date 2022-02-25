import { Playlist } from 'src/playlist/playlist.entity';
import {
    BaseEntity,
    Column,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class Track extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    melonId!: string;

    @ManyToMany((type) => Playlist, (playlist) => playlist.id)
    playlists: Playlist[];
}

export { Track };
