import { chunk } from 'lodash-es';

export class PromiseUtil {
    static async promiseAllBatched<T>(promiseList: Promise<T>[], batchSize: number): Promise<T[]> {
        const batchedPromiseList = chunk(promiseList, batchSize);
        const result: T[] = [];
        for (const batch of batchedPromiseList) {
            const batchResult = await Promise.all(batch);
            result.push(...batchResult);
        }
        return result;
    }
}
