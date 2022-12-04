import { Injectable } from '@nestjs/common';
import { nGram } from 'n-gram';

@Injectable()
export class SimilarityUtilService {
    nGramJaccardSimilarity(str1: string, str2: string, min: number, max: number): number {
        const nGramSetA = this.makeNGramSet(str1, min, max);
        const nGramSetB = this.makeNGramSet(str2, min, max);
        return this.jaccardSimilarity(nGramSetA, nGramSetB);
    }

    private jaccardSimilarity<T>(a: Set<T>, b: Set<T>): number {
        const intersectSize = this.intersect(a, b).size;
        return intersectSize / (a.size + b.size - intersectSize);
    }

    private makeNGramSet(str: string, min: number, max: number): Set<string> {
        let nGrams = [];
        for (let i = min; i <= max; i++) {
            nGrams = [...nGrams, ...nGram(i)(str)];
        }
        return new Set(nGrams);
    }

    private intersect<T>(a: Set<T>, b: Set<T>): Set<T> {
        const intersect = new Set<T>();
        for (const x of a) {
            if (b.has(x)) {
                intersect.add(x);
            }
        }
        return intersect;
    }
}
