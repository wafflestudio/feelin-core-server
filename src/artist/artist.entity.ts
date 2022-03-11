import { Album } from 'src/album/album.entity';
import { Track } from 'src/track/track.entity';
import { StreamService, StreamServiceEnum } from 'src/types';
import {
    BaseEntity,
    Column,
    Entity,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class Artist extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @OneToMany(() => StreamArtist, (streamArtist) => streamArtist.artist, {
        cascade: true,
    })
    streamArtists!: StreamArtist[];

    @OneToMany(() => Album, (album) => album.artist)
    albums!: Album[];

    @ManyToMany(() => Track, (track) => track.id)
    tracks!: Track[];
}

@Entity()
class StreamArtist extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'enum', enum: StreamServiceEnum })
    streamType!: StreamService;

    streamId!: string;

    @ManyToOne(() => Artist, (artist) => artist.streamArtists)
    artist!: Artist;
}

export { Artist, StreamArtist };
