import StreamTrack from '@track/streamTrack.entity.js';
import Track from '@track/track.entity.js';
import { isEqual } from 'lodash-es';
import { TrackInfo } from './types.js';

// TrackInfo interface
export function isSameTrack(a: TrackInfo, b: TrackInfo): boolean {
    return (
        a.title == b.title &&
        isEqual(a.artists.sort(), b.artists.sort()) &&
        a.album == b.album
    );
}

export function toStreamTrackEntity(trackInfo: TrackInfo): StreamTrack {
    const streamTrack = new StreamTrack();
    streamTrack.streamId = trackInfo.streamId;
    streamTrack.streamType = trackInfo.streamType;
    return streamTrack;
}

// TODO: Remove this function and change type
export function fromTrackEntity(track: Track): TrackInfo {
    const { title, artists, album } = track;
    const artistList = artists.map((artist) => artist.name);
    return {
        streamType: 'melon',
        title: title,
        streamId: '',
        artists: artistList,
        artistIds: [],
        album: album.title,
        albumId: '',
    };
}
