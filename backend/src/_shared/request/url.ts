import { AuthUserDetails } from '../auth/auth.i';
import { toNumber, toStringOr } from '../convert';
import { isNullish } from '../is';

export const composeUrl = (...input: any[]): string => {
    const parts = input
        .filter(i => !isNullish(i) && i !== '')
        .map(i => toStringOr(i)?.trim())
        .filter(i => !isNullish(i) && i !== '')
    ;
    const maxIndex = parts.length - 1;
    return parts.map((i, index) => {
        if (index) {
            i = i.replace(/\/$/, '');
        }
        if (index < maxIndex) {
            i = i.replace(/^\//, '');
        }
        return i;
    }).join('/');
};

export const filterUrlQueryParams = (inputUrl: string, filter: (key: string, params: URLSearchParams) => boolean): string => {
    const url = new URL(inputUrl);
    const filtered = new URLSearchParams();

    for (const [key, value] of url.searchParams.entries()) {
        if (filter(key, url.searchParams)) {
            filtered.append(key, value);
        }
    }

    url.search = filtered.toString();
    return url.toString();
};

export const setUrlQueryParams = (inputUrl: string, params: Record<any, any>, override: boolean = true): string => {
    const url = new URL(inputUrl);

    for (const [key, value] of Object.entries(params)) {
        if (override || !url.searchParams.has(key)) {
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
            if (override) {
                url.searchParams.delete(key);
            }
            if (!isNullish(valueToSet)) {
                for (const v of [].concat(valueToSet)) {
                    url.searchParams.append(key, v);
                }
            }
        }
    }
    return url.toString();
};

export const addUserQueryParams = (url: string, details: AuthUserDetails, override: boolean = true): string => {
    return setUrlQueryParams(url, {
        'loggedInUserClientId': toNumber(details.clientId),
        'userId': toNumber(details.userId),
        'locale': toStringOr(details.locale)
    }, override);
};

export const addPreferredUserQueryParams = (url: string, details: AuthUserDetails, override: boolean = true): string => {
    return setUrlQueryParams(url, {
        'preferredClientId': toNumber(details.clientId),
        'preferredUserId': toNumber(details.userId),
        'preferredLocale': toStringOr(details.locale)
    }, override);
}
