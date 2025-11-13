import { isNullish } from './is';

export const copyProperties = <T extends any>(value: any, filter: (k: string, o: T) => boolean): Partial<T> => {
    const ret = {};
    if (value) {
        for (const property of Object.keys(value)) {
            if (filter.call(this, property, value)) {
                ret[property] = value[property];
            }
        }
    }
    return ret;
};

export const filterProperties = <T extends any>(value: any, filter: (k: string, o: T) => boolean): Partial<T> => {
    if (value) {
        for (const property of Object.keys(value)) {
            if (!filter.call(this, property, value)) {
                delete value[property];
            }
        }
    }
    return value;
};

export const filterValues = <T extends any>(value: any, filter: (v: any, k: string, o: T) => boolean): Partial<T> => {
    if (value) {
        for (const property of Object.keys(value)) {
            if (!filter.call(this, value[property], property, value)) {
                delete value[property];
            }
        }
    }
    return value;
};

export const filterEmptyValues = <T extends any>(value: any): Partial<T> => {
    return filterValues(value, (v, k) => !isNullish(v));
};

export const getObjectKeyByValue = (source: any, value: any): string => {
    for (const k in source) {
        if (source[k] === value) {
            return k;
        }
    }
    return null;
};

export const keepSimple = (value: any, visited: Set<any> = new Set<any>()): any => {
    if (typeof value === 'object') {

        if (visited.has(value)) {
            return undefined;
        }
        visited.add(value);

        if (!value) {
            return value;
        }

        if (Array.isArray(value)) {
            return value.map(i => keepSimple(i, visited));
        }

        const _value = {};
        for (const k in value) {
            if (!k.startsWith('_')) {
                const v = keepSimple(value[k], visited);
                if (!isNullish(v)) {
                    _value[k] = v;
                }
            }
        }
        return _value;

    }

    if (typeof value === 'function') {
        return undefined;
    }

    return value;
};

export const stripNullishValues = <T extends any>(value: any): T => {
    for (const [k, v] of Object.entries(value)) {
        if (isNullish(v)) {
            delete value[k];
        }
    }
    return value;
};
