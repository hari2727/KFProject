export interface MapOf<T> {
    [ key: string ]: T;
}

export interface Indexed<T> {
    index: number;
    value: T;
}

export const mapBy = <T extends any>(values: T[], indexer: (value: T) => string): MapOf<T> => {
    const map: MapOf<T> = {};
    for (const value of values) {
        map[indexer(value)] = value;
    }
    return map;
}

export const groupBy = <T extends any>(values: T[], indexer: (value: T) => string): MapOf<T[]> => {
    const map: MapOf<T[]> = {};
    for (const value of values) {
        const key = indexer(value);
        (
            map[key] = map[key] || []
        ).push(value);
    }
    return map;
}

export const orderBy = <T extends any>(values: T[], indexer: (value: T) => number): T[] => {
    return values.sort((a, b) => indexer(a) - indexer(b));
}

export const indexValues = <T extends any>(values: T[]): Indexed<T>[] => {
    return values.map(toIndexed);
}

export const toIndexed = <T extends any>(value: T, index: number): Indexed<T> => {
    return { index, value };
}

export const toUnique = <T extends any>(values: T[]): T[] => {
    return [...new Set(values)];
}

export const toArray = <T extends any>(value: T | T[]): T[] => {
    // @ts-ignore
    return [].concat(value);
}

export const firstOf = <T extends any>(values: T[]): T => {
    return values[0];
}

export const lastOf = <T extends any>(values: T[]): T => {
    return values[ values.length - 1 ];
}

export const getMedian = (values: number[]): number | undefined => {
    if (!values.length) {
        return undefined;
    }
    values = values.slice().sort();
    const midIndex = Math.floor(values.length / 2);
    return (
        values.length % 2
            ? values[midIndex]
            : (values[midIndex - 1] + values[midIndex]) / 2
    );
}
