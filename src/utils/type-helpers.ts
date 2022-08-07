export type PartialRecord<K, V> = Partial<Record<keyof K, V>>;

export declare function pick<T, K extends keyof T>(
    obj: T,
    ...keys: K[]
): Pick<T, K>;
