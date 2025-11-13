import { safeString } from '../_shared/safety';

export abstract class RequestFactoryBase {

    protected buildURL(...input: any[]): string {
        return input.join('/').split('://').map(s => s.replace(/\/+/g, '/')).join('://');
    }

    protected buildRequestQuery(query: object): string {
        const a = [];
        const filtered = this.filterEmpty(query);
        for (const k in filtered) {
            const v = filtered[k];
            a.push([k, typeof v === 'object' ? encodeURIComponent(JSON.stringify(v)) : v].join('='));
        }
        return a.join('&');
    }

    protected buildRequestBody<T>(body: T): T {
        return body === null || body === undefined ? undefined : body;
    }

    protected pushQueryParams(url: string, query: string): string {
        return query ? `${url}${url.includes('?') ? '&' : '?'}${query}` : url;
    }

    protected filterEmpty<T>(raw: T): T {
        const o: any = {};
        for (const k in raw) {
            const v = raw[k];
            if (v === null || v === undefined || (typeof v === 'number' && isNaN(v))) {
                continue;
            }
            o[k] = v;
        }
        return o as T;
    }

    protected throwError(message: string): void {
        throw new Error(safeString(message));
    }
}
