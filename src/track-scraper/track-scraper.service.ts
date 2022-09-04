import { isSameTrack } from '@feelin-types/helpers.js';
import { ITrack, Vendors } from '@feelin-types/types.js';
import { Injectable } from '@nestjs/common';
import { nGram } from 'n-gram';
import { FloTrackScraper } from './flo-track-scraper.service.js';
import { MelonTrackScraper } from './melon-track-scraper.service.js';
import { TrackScraper } from './TrackScraper.js';

@Injectable()
export class TrackScraperService {
    trackScrapers: { [key in Vendors]: TrackScraper };

    constructor(private readonly melonTrackScraper: MelonTrackScraper, private readonly floTrackScraper: FloTrackScraper) {
        this.trackScrapers = {
            melon: melonTrackScraper,
            flo: floTrackScraper,
        };
    }

    get(vendor: Vendors): TrackScraper {
        return this.trackScrapers[vendor];
    }

    async matchTracks(candidates: ITrack[], reference: ITrack): Promise<ITrack | null> {
        const MIN_NGRAM = 1;
        const MAX_NGRAM = 4;
        const THRESHOLD = 0.1;

        if (candidates.length === 0) {
            return null;
        }
        const match = candidates.filter((track) => {
            return isSameTrack(reference, track);
        });

        if (match.length === 0) {
            const scores = candidates.map((trackInfo) => {
                return {
                    trackInfo,
                    score: 1.0,
                };
            });
            const titleNGrams = await this.makeNGramSet(reference.title, MIN_NGRAM, MAX_NGRAM);
            const albumNGrams = await this.makeNGramSet(reference.album.title, MIN_NGRAM, MAX_NGRAM);
            for (const track of scores) {
                track.score *= this.jaccardSimilarity(
                    titleNGrams,
                    await this.makeNGramSet(track.trackInfo.title, MIN_NGRAM, MAX_NGRAM),
                );
            }
            for (const track of scores) {
                track.score *= +(track.trackInfo.artists.length === reference.artists.length);
            }
            for (const track of scores) {
                track.score *= this.jaccardSimilarity(
                    albumNGrams,
                    await this.makeNGramSet(track.trackInfo.album.title, MIN_NGRAM, MAX_NGRAM),
                );
            }

            scores.sort((a, b) => b.score - a.score);
            if (scores[0].score < THRESHOLD) {
                console.log(scores[0]);
                console.log(scores[1]?.score);
                console.log(reference);
                return null;
            }
            return scores[0].trackInfo;
        }

        return match[0];
    }

    async makeNGramSet(str: string, min: number, max: number): Promise<Set<string>> {
        let nGrams = [];
        for (let i = min; i <= max; i++) {
            nGrams = [...nGrams, ...nGram(i)(str)];
        }
        return new Set(nGrams);
    }

    intersect<T>(a: Set<T>, b: Set<T>): Set<T> {
        const intersect = new Set<T>();
        for (const x of a) {
            if (b.has(x)) {
                intersect.add(x);
            }
        }
        return intersect;
    }

    jaccardSimilarity<T>(a: Set<T>, b: Set<T>): number {
        const intersectSize = this.intersect(a, b).size;
        return intersectSize / (a.size + b.size - intersectSize);
    }
}
