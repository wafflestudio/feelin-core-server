import _ from 'lodash-es';
import { TrackInfo } from './types.js';

export type ValuesToArray<T> = { [P in keyof T]: T[P][] };

export function isExactMatch(a: TrackInfo, b: TrackInfo, isDetailed: boolean): boolean {
    if (isDetailed) {
        return (
            a.title == b.title &&
            _.isEqual(_.sortBy(a.artists.map(({ name }) => name)), _.sortBy(b.artists)) &&
            a.album.title == b.album.title
        );
    }
    return a.title == b.title && a.artistNames == b.artistNames && a.albumTitle == b.albumTitle;
}
