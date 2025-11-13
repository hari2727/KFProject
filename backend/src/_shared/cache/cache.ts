import { ms } from '../async';
import { isNullish } from '../is';

const now = (): number => new Date().getTime();

export class Cache<V extends any, K extends any> {

    protected values = new Map<K, V>();
    protected ts = new Map<K, number>();

    constructor(
        protected name: string,
        protected maxSize: number = 1024,
        protected ttlMilliseconds: number = 1000 * 60 * 60,
    ) {
    }

    protected getValidValue(key: K): { value: V } {
        if (this.values.has(key) && this.ts.has(key)) {
            const value = this.values.get(key);
            const ts = this.ts.get(key);
            if (ts && (ts + this.ttlMilliseconds) >= now()) {
                return { value };
            }
        }
        return null;
    }

    protected contract(): void {
        const removeCount = Math.max(this.values.size - this.maxSize, 0);
        if (removeCount) {
            let i = 0;
            for (const k of this.values.keys()) {
                if (i++ >= removeCount) {
                    break;
                }
                this.values.delete(k);
                this.ts.delete(k);
            }
        }
    }

    get(key: K): V {
        return this.getValidValue(key)?.value;
    }

    set(key: K, value: V): void {
        this.ts.set(key, now());
        this.values.set(key, value);
        ms(500).then(() => this.contract());
    }

    has(key: K): boolean {
        return !isNullish(this.getValidValue(key));
    }

    delete(key: K): boolean {
        const ts = this.ts.delete(key);
        const value = this.values.delete(key);
        return ts && value;
    }

    clear(): void {
        this.ts.clear();
        this.values.clear();
    }
}
