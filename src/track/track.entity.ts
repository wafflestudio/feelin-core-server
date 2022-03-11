import { Album } from 'src/album/album.entity';
import { Artist } from 'src/artist/artist.entity';
import { Playlist } from 'src/playlist/playlist.entity';
import { StreamService, StreamServiceEnum } from 'src/types';
import {
    BaseEntity,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class Track extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @ManyToMany(() => Playlist, (playlist) => playlist.id)
    playlists: Playlist[];

    @OneToMany(() => StreamTrack, (streamTrack) => streamTrack.track, {
        cascade: true,
    })
    streamTracks!: StreamTrack[];

    @ManyToMany(() => Artist, (artist) => artist.id, {
        cascade: true,
    })
    @JoinTable()
    artists!: Artist[];

    @ManyToOne(() => Album, (album) => album.tracks, {
        cascade: true,
    })
    album!: Album;
}

@Entity()
class StreamTrack extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'enum', enum: StreamServiceEnum })
    streamType!: StreamService;

    streamId!: string;

    @ManyToOne(() => Track, (track) => track.streamTracks)
    track!: Track;
}

export { Track, StreamTrack };
