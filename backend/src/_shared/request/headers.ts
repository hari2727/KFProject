import { isNullish } from '../is';
import { toStringOr } from '../convert';
import { AuthSessionDetails } from '../auth/auth.i';
import { copyProperties } from '../object';

export const filterHeaders = (headers: any, filter: (key: string, value: any, headers: any) => boolean): any => {
    const ret = {};
    for (const [key, value] of Object.entries(headers ?? {})) {
        if (filter(key, value, headers)) {
            ret[key] = value;
        }
    }
    return ret;
};

export const setHeaders = <T extends any>(headers: any, params: Record<any, any>, override: boolean = true): T => {
    headers ??= {};

    const ret = { ...headers };

    const headerNames = Object.fromEntries(Object.keys(headers).map(i => [i.toLowerCase(), i]));

    for (const [key, value] of Object.entries(params)) {
        let normKey = key.toLowerCase();
        normKey = headerNames[normKey] ?? normKey;

        if (override || isNullish(ret[normKey])) {
            let valueToSet;

            if (!isNullish(value)) {
                if (!Array.isArray(value)) {
                    valueToSet = toStringOr(value);
                } else if (value.length) {
                    const v = value.map(i => toStringOr(i)).filter(i => !isNullish(i));
                    if (v.length) {
                        valueToSet = v;
                    }
                }
            }

            if (!isNullish(valueToSet)) {
                ret[normKey] = valueToSet;
            } else {
                delete ret[normKey];
            }
        }
    }
    return ret;
};

export const getHeaderValues = (headers: any, key: string): string[] => {
    key = key.toLowerCase();
    for (const [k, v] of Object.entries(headers)) {
        if (k.toLowerCase() === key) {
            return [].concat(v).map(i => toStringOr(i));
        }
    }
    return undefined;
};

export const getHeaderValue = (headers: any, key: string): string => {
    return getHeaderValues(headers, key)?.pop();
};

export const copyContentHeaders = (headers: any): any => {
    return copyProperties(headers ?? {}, k => k.toLowerCase().startsWith('content-'));
};

export const stripAuthHeaders = <T extends any>(headers: any): Partial<T> => {
    return setHeaders(headers, {
        'authtoken': undefined,
        'ps-session-id': undefined
    }, true);
};

export const addAuthHeaders = <T extends any>(headers: any, details: AuthSessionDetails, override: boolean = true): T => {
    return setHeaders(headers, {
        'authtoken': toStringOr(details.authToken),
        'ps-session-id': toStringOr(details.sessionId)
    }, override);
}
