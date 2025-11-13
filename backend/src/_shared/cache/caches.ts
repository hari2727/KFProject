import { Injectable } from '@nestjs/common';
import { Cache } from './cache';

@Injectable()
export class Caches {

    getCache<V extends any, K extends any>(name: string, maxSize?: number, ttlMilliseconds?: number): Cache<V, K> {
        return new Cache<V, K>(name, maxSize, ttlMilliseconds);
    }
}
