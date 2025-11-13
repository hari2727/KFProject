import * as JSON5 from 'json5';
import { isEnumValue, isInstanceOf, isKeyOf, isListValue, isNullish, isPositiveInteger } from './is';
import { _filterLocaleValue } from './filter';

export const toNumber = (value: any, orValue: number = null): number => {
    if (isNullish(value) || value === '' || typeof value === 'object') {
        return orValue;
    }
    const asNumber = Number(value);
    return isNaN(asNumber) ? orValue : asNumber;
};

export const toBoolean = (value: any): boolean => {
    if (typeof value === 'string' || value instanceof String) {
        if ('false' === String(value).toLowerCase()) {
            return false;
        }
    }
    {
        const falsy = Boolean(value);
        if (!falsy) {
            return falsy;
        }
    }
    {
        const n = toNumber(value, 1);
        if (!isNaN(n)) {
            return Boolean(n);
        }
    }
    return true;
};

export const toBit = (value: any): 1 | 0 => {
    return Number(toBoolean(value)) as (1 | 0);
};

export const toStringOr = (value: any, orValue: string = null): string => {
    return value?.toString() ?? orValue;
};

export const toLocale = (value: any, orValue: string = ''): string => {
    return _filterLocaleValue(value);
};

export const toJsonOr = (value: any, orValue = null): string => {
    try {
        return JSON.stringify(value);
    } catch (e) {
    }
    return orValue;
};

export const fromJsonOr = <T = any>(value: any, orValue = null): T => {
    try {
        return JSON5.parse(value);
    } catch (e) {
    }
    return orValue;
};

export const toDateOr = (value: any, orValue = null): Date => {
    try {
        const d = value instanceof Date ? value : new Date(value);
        if (!isNaN(d.getTime())) {
            return d;
        }
    } catch (e) {
    }
    return orValue;
};

export const toRegexpOr = (value: any, orValue = null): RegExp => {
    try {
        const match = value.match(/^\/(.*)\/([a-z]*)$/i);
        if (!match) {
            throw true;
        }
        const [, pattern, flags] = match;
        return new RegExp(pattern, flags);
    } catch (e) {
    }
    return orValue;
};

export const toArrayOr = (value: any): any[] => {
    if (isNullish(value)) {
        return [];
    }
    if (Array.isArray(value)) {
        return value;
    }
    if (
        typeof value === 'object' &&
        !isInstanceOf(value, Map) &&
        (
            Object.prototype.hasOwnProperty.call(value, 'callee') ||
            typeof value?.[Symbol.iterator] === 'function'
        )
    ) {
        return Array.from(value);
    }
    return [value];
};

export const toListValue = (value: any, enu: any[], orValue = null): any => {
    try {
        if (isListValue(value, enu)) {
            return value;
        }
    } catch (e) {
    }
    return orValue;
};

export const toEnumValue = (value: any, enu: any, orValue = null): any => {
    try {
        if (isEnumValue(value, enu)) {
            return value;
        }
    } catch (e) {
    }
    return orValue;
};

export const toKeyOf = (value: any, enu: any, orValue = null): any => {
    try {
        if (isKeyOf(value, enu)) {
            return value;
        }
    } catch (e) {
    }
    return orValue;
};

export const toPositiveInteger = (value: any, orValue: number = null): number => {
    value = toNumber(value, orValue);
    if (isPositiveInteger(value)) {
        return value;
    }
    return orValue;
};

export const toNonEmptyString = (value: any, orValue: string = null): string => {
    value = toStringOr(value, orValue)?.trim();
    if (!isNullish(value) && value.length > 0) {
        return value;
    }
    return orValue?.trim();
};

export const NoResult = Symbol('EmptyResult');
