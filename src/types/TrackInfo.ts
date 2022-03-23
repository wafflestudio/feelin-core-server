import { isEqual } from 'lodash';
import { Track } from 'src/track/track.entity';
import { StreamService } from './StreamService';

class TrackInfo {
    title: string;
    artists: string[];
    album: string;
    service: StreamService;
    id: string;

    // constructor
    constructor(
        title: string,
        artists: string[],
        album: string,
        service: StreamService,
        id: string,
    ) {
        this.title = title;
        this.artists = artists;
        this.album = album;
        this.service = service;
        this.id = id;
    }

    static fromEntity(track: Track): TrackInfo {
        const { title, artists, album, streamTracks } = track;
        const artistList = artists.map((artist) => artist.name);
        return new TrackInfo(
            title,
            artistList,
            album.title,
            streamTracks[0].streamType,
            streamTracks[0].streamId,
        );
    }

    isEqual(trackInfo: TrackInfo): Boolean {
        return (
            this.title == trackInfo.title &&
            isEqual(this.artists.sort(), trackInfo.artists.sort()) &&
            this.album == trackInfo.album
        );
    }
}

export default TrackInfo;
