import { TrackSearchResultDto } from '@/playlist/dto/track-search-result.dto.js';
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

    getMatchedVendorTrack(candidates: TrackSearchResultDto[], reference: TrackInfo): TrackSearchResultDto | null {
        if (candidates.length === 0) {
            return null;
        }

        const exactMatches = candidates.filter((track) => isExactMatch(reference, track));
        if (!!exactMatches) {
            return exactMatches[0];
        }

        const { title: referenceTitle, artists: referenceArtists, album: referenceAlbum } = reference;

        const candidatesWithScores = candidates.map((trackInfo) => {
            const { title, artists, album } = trackInfo;

            const titleScore = this.similarityUtilService.nGramJaccardSimilarity(
                referenceTitle,
                title,
                this.MIN_NGRAM,
                this.MAX_NGRAM,
            );

            const artistsScore = referenceArtists.reduce((score, referenceArtist) => {
                return (
                    score *
                    Math.max(
                        ...artists.map((artistName) =>
                            this.similarityUtilService.nGramJaccardSimilarity(
                                referenceArtist.name,
                                artistName,
                                this.MIN_NGRAM,
                                this.MAX_NGRAM,
                            ),
                        ),
                    )
                );
            }, 1.0);

            const albumScore = this.similarityUtilService.nGramJaccardSimilarity(
                referenceAlbum.title,
                album,
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
