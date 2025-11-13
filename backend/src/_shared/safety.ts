import { toNumber, toStringOr } from './convert';
import { _filterLocaleValue, _filterStopWords } from './filter';
import { jj } from './test/oj';

export const filterStopWords = _filterStopWords;

export const filterLocaleValue = _filterLocaleValue;

export const safeNumber = (value: any): number => toNumber(value);

export const safeLocale = (value: any): string => _filterLocaleValue(value) ?? '';

export const safeEnum = (value: any): string => /^[a-z\d_]+$/i.test(value) ? String(value) : '';

export const safeQueryValue = (value: any): string => String(value).includes('&') ? '' : String(value);

export const safeCRLFString = (value: any): string => toStringOr(value)?.replace(/([\r\n])/g, '\$1');

export const safeMarkupString = (value: any): string => {
    let s = toStringOr(value);
    if (s?.includes('<')) {
        s = s.replace(/<(\s*[a-zA-Z]+(-*[a-zA-Z]*\d*)([a-zA-Z]?\d?)*\s*)/g, '&lt;$1');
        s = s.replace(/<(\s*\/\s*[a-zA-Z]+(-*[a-zA-Z]*\d*)([a-zA-Z]?\d?)*\s*>)/g, '&lt;$1');
        s = s.replace(/<(\s*!--)/g, '&lt;$1');
    }
    return s;
}

export const safeString = (value: any): string =>
    safeCRLFString(
        safeMarkupString(
            value
        )
    );

export const safeJSON = (value: any): string =>
    jj(value);
