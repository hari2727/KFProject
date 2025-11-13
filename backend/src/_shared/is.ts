import { isPlainObject } from '@nestjs/common/utils/shared.utils';

export const isNullish = (value: unknown): boolean =>
    value === null || value === undefined;

export const isInstanceOf = (value: unknown, of: any): boolean =>
    value instanceof of;

export const isInteger = (value: any): boolean =>
    !(isNullish(value) || value % 1 );

export const isPositiveInteger = (value: any): boolean =>
    isInteger(value) && value > 0;

export const isEmptyPlainObject = (value: any): boolean =>
    isPlainObject(value) && !Object.keys(value).length;

export const isListValue = (value: any, list: any[]): boolean =>
    list.includes(value);

export const isEnumValue = (value: any, enu: any): boolean =>
    isListValue(value, Object.values(enu));

export const isKeyOf = (value: any, enu: any): boolean =>
    isListValue(value, Object.keys(enu));
