import { isEqual } from 'lodash-es';

class trackInfo {
    service: string;
    title: string;
    artists: string[];
    album: string;

    // constructor
    constructor(
        service: string,
        title: string,
        artists: string[],
        album: string,
    ) {
        this.service = service;
        this.title = title;
        this.artists = artists;
        this.album = album;
    }

    isEqual(trackInfo: trackInfo): Boolean {
        return (
            this.title == trackInfo.title &&
            isEqual(this.artists.sort(), trackInfo.artists.sort()) &&
            this.album == trackInfo.album
        );
    }
}

export { trackInfo };
