import { Album } from 'src/album/album.entity';
import { Artist } from 'src/artist/artist.entity';
import { Playlist } from 'src/playlist/playlist.entity';
import { StreamService, StreamServiceEnum, TrackInfo } from 'src/types';
import {
    BaseEntity,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
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
@Unique('STREAM_TRACK_ID', ['streamId', 'streamType'])
class StreamTrack extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'enum', enum: StreamServiceEnum })
    streamType!: StreamService;

    @Column({ unique: true })
    streamId!: string;

    @ManyToOne(() => Track, (track) => track.streamTracks)
    track!: Track;

    static fromTrackInfo(trackInfo: TrackInfo) {
        const streamTrack = new StreamTrack();
        streamTrack.streamId = trackInfo.id;
        streamTrack.streamType = trackInfo.service;
        return streamTrack;
    }
}

export { Track, StreamTrack };
