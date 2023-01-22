import _ from 'lodash-es';
import { TrackSearchResultDto } from './../playlist/dto/track-search-result.dto';
import { TrackInfo } from './types.js';

export type ValuesToArray<T> = { [P in keyof T]: T[P][] };

export function isExactMatch(a: TrackInfo, b: TrackSearchResultDto): boolean {
    return (
        a.title == b.title &&
        _.isEqual(_.sortBy(a.artists.map(({ name }) => name)), _.sortBy(b.artists)) &&
        a.album.title == b.album
    );
}
