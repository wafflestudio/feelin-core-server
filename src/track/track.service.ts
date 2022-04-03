import { Injectable } from '@nestjs/common';
import { StreamServiceEnum, TrackInfo } from 'src/types';
import TrackManagers, { matchTracks } from './functions';
import { StreamTrack, Track } from './track.entity';

@Injectable()
export class TrackService {
    constructor() {}

    async getMatchingTracks(track: Track): Promise<StreamTrack[]> {
        const { streamTracks } = track;
        const reference = TrackInfo.fromEntity(track);

        const searchPromise: Promise<TrackInfo[]>[] = [];
        for (const streamType of StreamServiceEnum) {
            if (streamType === streamTracks[0].streamType) {
                continue;
            }
            searchPromise.push(
                TrackManagers[streamType]?.searchTrack(reference),
            );
        }
        const searchResults = await Promise.all(searchPromise);

        const matchPromise: Promise<StreamTrack>[] = [];
        for (const searchResult of searchResults) {
            const match = matchTracks(searchResult, reference);
            matchPromise.push(match);
        }
        const matches = await Promise.all(matchPromise);
        return matches;
    }
}
