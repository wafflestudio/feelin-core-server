import { TrackSearchResultDto } from './../playlist/dto/track-search-result.dto';
import _ from 'lodash-es';
import { ITrack } from './types.js';

export type ValuesToArray<T> = { [P in keyof T]: T[P][] };

export function collectToObject<T>(objArray: T[]): ValuesToArray<T> {
    return objArray.reduce((newObj: ValuesToArray<T>, obj: T): ValuesToArray<T> => {
        (Object.keys(obj) as (keyof T)[]).forEach((key, _) => {
            if (newObj[key] === undefined) {
                newObj[key] = [obj[key]];
            } else {
                // FIXME: Not a great way to modify the object??
                newObj[key].push(obj[key]);
            }
        });
        return newObj;
    }, {} as ValuesToArray<T>);
}

export function isExactMatch(a: ITrack, b: TrackSearchResultDto): boolean {
    return (
        a.title == b.title &&
        _.isEqual(_.sortBy(a.artists.map(({ name }) => name)), _.sortBy(b.artists)) &&
        a.album.title == b.album
    );
}
