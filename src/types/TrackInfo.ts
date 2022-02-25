import { isEqual } from 'lodash';
import { StreamService } from './StreamService';

class TrackInfo {
    service: StreamService;
    title: string;
    id: string;
    artists: string[];
    album: string;

    // constructor
    constructor(
        service: StreamService,
        title: string,
        id: string,
        artists: string[],
        album: string,
    ) {
        this.service = service;
        this.title = title;
        this.id = id;
        this.artists = artists;
        this.album = album;
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
