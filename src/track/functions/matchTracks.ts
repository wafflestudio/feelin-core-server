import { nGram } from 'n-gram';
import { TrackInfo } from 'src/types';
import { StreamTrack } from '../track.entity';

/**
 *
 * Simple matching algorithm, compares title, artists, album and return true if all are same
 * @param candidates Search results to find match in
 * @param reference The reference
 * @returns Matching TrackInfo
 */

function makeNGramSet(str: string, min: number, max: number): Set<string> {
    let nGrams = [];
    for (let i = min; i <= max; i++) {
        nGrams = [...nGrams, ...nGram(i)(str)];
    }
    return new Set(nGrams);
}

function intersect<T extends any>(a: Set<T>, b: Set<T>): Set<T> {
    const intersect = new Set<T>();
    for (const x of a) {
        if (b.has(x)) {
            intersect.add(x);
        }
    }
    return intersect;
}

function jaccardSimilarity<T extends any>(a: Set<T>, b: Set<T>): number {
    const intersectSize = intersect(a, b).size;
    return intersectSize / (a.size + b.size - intersectSize);
}

const MIN_NGRAM = 1;
const MAX_NGRAM = 6;
const THRESHOLD = 0.5;

async function matchTracks(
    candidates: TrackInfo[],
    reference: TrackInfo,
): Promise<StreamTrack | null> {
    if (candidates.length === 0) {
        return null;
    }
    const match = candidates.filter((track) => {
        return track.isEqual(reference);
    });

    if (match.length === 0) {
        const scores = candidates.map((trackInfo) => {
            return {
                trackInfo,
                score: 1.0,
            };
        });
        const titleNGrams = makeNGramSet(reference.title, MIN_NGRAM, MAX_NGRAM);
        const albumNGrams = makeNGramSet(reference.album, MIN_NGRAM, MAX_NGRAM);
        for (const track of scores) {
            track.score *= Math.max(
                jaccardSimilarity(
                    titleNGrams,
                    makeNGramSet(track.trackInfo.title, MIN_NGRAM, MAX_NGRAM),
                ),
                jaccardSimilarity(
                    titleNGrams,
                    makeNGramSet(
                        track.trackInfo.titleNoParan,
                        MIN_NGRAM,
                        MAX_NGRAM,
                    ),
                ),
            );
        }
        for (const track of scores) {
            track.score *= +(
                track.trackInfo.artists.length === reference.artists.length
            );
        }
        for (const track of scores) {
            track.score *= Math.max(
                jaccardSimilarity(
                    albumNGrams,
                    makeNGramSet(track.trackInfo.album, MIN_NGRAM, MAX_NGRAM),
                ),
                jaccardSimilarity(
                    albumNGrams,
                    makeNGramSet(
                        track.trackInfo.albumNoParan,
                        MIN_NGRAM,
                        MAX_NGRAM,
                    ),
                ),
            );
        }

        scores.sort((a, b) => b.score - a.score);
        if (scores[0].score < THRESHOLD) {
            console.log(scores[0]);
            console.log(reference);
            return null;
        }
        return StreamTrack.fromTrackInfo(scores[0].trackInfo);
    }

    return StreamTrack.fromTrackInfo(match[0]);
}

export default matchTracks;
