import { SearchResults } from '@/track/types/types.js';
import { isExactMatch } from '@/types/helpers.js';
import { TrackInfo } from '@/types/types.js';
import { SimilarityUtilService } from '@/utils/similarity-util/similarity-util.service.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TrackMatcherService {
    constructor(private readonly similarityUtilService: SimilarityUtilService) {}

    readonly THRESHOLD = 0.1;
    readonly MIN_NGRAM = 1;
    readonly MAX_NGRAM = 4;

    getMatchedVendorTrack(result: SearchResults, reference: TrackInfo): TrackInfo | null {
        const candidates = result.results;
        if (candidates.length === 0) {
            return null;
        }

        const exactMatches = candidates.filter((track) => isExactMatch(reference, track, result.isDetailed));
        if (!!exactMatches) {
            return exactMatches[0];
        }

        const { title: referenceTitle, artists: referenceArtists, album: referenceAlbum } = reference;

        const candidatesWithScores = candidates.map((trackInfo) => {
            const { title, artists, album, artistNames } = trackInfo;

            const titleScore = this.similarityUtilService.nGramJaccardSimilarity(
                referenceTitle,
                title,
                this.MIN_NGRAM,
                this.MAX_NGRAM,
            );

            let artistsScore = 1.0;
            if (result.isDetailed) {
                artistsScore = referenceArtists.reduce((score, referenceArtist) => {
                    return (
                        score *
                        Math.max(
                            ...artists.map(({ name }) =>
                                this.similarityUtilService.nGramJaccardSimilarity(
                                    referenceArtist.name,
                                    name,
                                    this.MIN_NGRAM,
                                    this.MAX_NGRAM,
                                ),
                            ),
                        )
                    );
                }, 1.0);
            } else {
                artistsScore = referenceArtists.reduce((score, referenceArtist) => {
                    return (
                        score *
                        this.similarityUtilService.nGramJaccardSimilarity(
                            referenceArtist.name,
                            artistNames,
                            this.MIN_NGRAM,
                            this.MAX_NGRAM,
                        )
                    );
                }, 1.0);
            }

            const albumScore = this.similarityUtilService.nGramJaccardSimilarity(
                referenceAlbum.title,
                album.title,
                this.MIN_NGRAM,
                this.MAX_NGRAM,
            );

            return {
                trackInfo,
                score: titleScore * artistsScore * albumScore,
            };
        });

        const bestMatch = candidatesWithScores.reduce(
            (bestMatch, candidate) => {
                return candidate.score > bestMatch.score ? candidate : bestMatch;
            },
            { trackInfo: null, score: -1 },
        );

        if (bestMatch.score >= this.THRESHOLD) {
            return bestMatch.trackInfo;
        }
        return null;
    }
}
