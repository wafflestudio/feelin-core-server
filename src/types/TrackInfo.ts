import { isEqual } from 'lodash';
import { Track } from 'src/track/track.entity';
import { StreamService } from './StreamService';

function preprocess(str: string, removeParans?: boolean): string {
    if (removeParans) {
        str = str.replace(/ *\([^)]*\) */g, '');
    }
    return str.trim().toLowerCase();
}
class TrackInfo {
    title: string;
    titleNoParan: string;
    artists: string[];
    album: string;
    albumNoParan: string;
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
        this.title = preprocess(title);
        this.titleNoParan = preprocess(title, true);
        this.artists = artists;
        this.album = preprocess(album);
        this.albumNoParan = preprocess(album, true);
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

    isEqual(trackInfo: TrackInfo): boolean {
        return (
            this.title == trackInfo.title &&
            isEqual(this.artists.sort(), trackInfo.artists.sort()) &&
            this.album == trackInfo.album
        );
    }
}

export default TrackInfo;
