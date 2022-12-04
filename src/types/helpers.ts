import { isEqual } from 'lodash-es';
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

// ITrack interface
export function isSameTrack(a: ITrack, b: ITrack): boolean {
    return a.title == b.title && isEqual(a.artists.sort(), b.artists.sort()) && a.album == b.album;
}
