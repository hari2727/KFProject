import { toNumber } from '../convert';

export const startedAtSymbol = Symbol('startedAtSymbol');

export const setStartedAt = <T extends any>(value: T, ms: number): T => {
    try {
        value[startedAtSymbol] = ms;
    } catch (e) {
    }
    return value;
};

export const getStartAt = (value: any): number => {
    try {
        return toNumber(value[startedAtSymbol])
    } catch (e) {
        return Number.POSITIVE_INFINITY;
    }
};

export const isWithinThreshold = (value: any, ms: number = 2500): boolean => {
    return performance.now() - getStartAt(value) < ms;
};
