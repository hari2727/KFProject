import { isFunction } from '@nestjs/common/utils/shared.utils';
import { isNullish } from './is';
import { setStartedAt } from './track/start';

export const ms = (ms: number): Promise<void> => {
    return new Promise<void>(resolve => setTimeout(() => resolve(null), ms));
};

export const isPromiseLike = (value: unknown): value is PromiseLike<unknown> => {
    return (
        !isNullish(value) &&
        isFunction((value as any)?.then) &&
        isFunction((value as any)?.catch)
    );
};

export const safeCall = async <T>(cb: Promise<T> | (() => Promise<T> | T)): Promise<Awaited<T>> => {
    const startedAt = performance.now();

    try {
        const ret = isFunction(cb) ? cb() : cb;
        if (isPromiseLike(ret)) {
            return await ret.catch(e => {
                throw setStartedAt(e, startedAt);
            });
        }
        return ret as Awaited<T>;
    } catch (e) {
        return Promise.reject<any>(setStartedAt(e, startedAt));
    }
};
