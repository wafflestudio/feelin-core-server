import { isEqual } from 'lodash-es';

type streamingService =
    | 'melon'
    | 'flo'
    | 'genie'
    | 'bugs'
    | 'vibe'
    | 'ytmusic'
    | 'spotify'
    | 'applemusic';

class TrackInfo {
    service: streamingService;
    title: string;
    id: string;
    artists: Array<string>;
    album: string;

    // constructor
    constructor(
        service: streamingService,
        title: string,
        id: string,
        artists: Array<string>,
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
