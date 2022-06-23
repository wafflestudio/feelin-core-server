import { Injectable } from '@nestjs/common';
import matchTracks from 'src/track-scraper/matchTracks';
import { TrackScraperService } from 'src/track-scraper/track-scraper.service';
import { StreamServiceEnum, TrackInfo } from 'src/types';
import { StreamTrack, Track } from './track.entity';

@Injectable()
export class TrackService {
    constructor(private readonly trackScraperService: TrackScraperService) {}

    async getMatchingTracks(track: Track): Promise<StreamTrack[]> {
        const { streamTracks } = track;
        const reference = TrackInfo.fromEntity(track);

        const searchPromise: Promise<TrackInfo[]>[] = [];
        for (const streamType of StreamServiceEnum) {
            if (streamType === streamTracks[0].streamType) {
                continue;
            }
            searchPromise.push(
                this.trackScraperService.get(streamType).searchTrack(reference),
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
