import { chunk } from 'lodash-es';

export class PromiseUtil {
    static async promiseAllBatched<T, U>(promiseList: T[], mappingFunc: (arg: T) => Promise<U>, batchSize: number): Promise<U[]> {
        const batchedPromiseList = chunk(promiseList, batchSize);
        const result: U[] = [];
        for (const batch of batchedPromiseList) {
            const batchResult = await Promise.all(batch.map(mappingFunc));
            result.push(...batchResult);
        }
        return result;
    }
}
