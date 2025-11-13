import {
    RandomBinaryOptions,
    RandomEmailOptions,
    RandomFloatOptions,
    RandomOptions,
    RandomStringOptions,
    RandomURLOptions
} from './fixture.i';
import { alphabeticDict, numericDict, protocolsDict, specialDict } from './fixture.const';
import { clamp, getNextNumber } from '../number';

const toSorted = (...a: number[]): number[] => {
    return a.sort((a, b) => a - b);
};

const withDefaultRandomOptions = (defaultOptions: RandomOptions, options?: RandomOptions): RandomOptions => {
    const [
        min,
        max
    ] = toSorted(
        options?.max ?? defaultOptions.max,
        options?.min ?? defaultOptions.min
    );
    return {
        ...(options || {}),
        min,
        max
    };
};

const toRandomOptions = (options?: RandomOptions): RandomOptions => {
    return withDefaultRandomOptions({ min: 0, max: 1000 }, options);
};

const toRandomFloatOptions = (options?: RandomFloatOptions): RandomFloatOptions => {
    const precision = clamp(options?.precision ?? 2, 1, 10);
    return {
        ...toRandomOptions(options),
        precision
    };
};

const toRandomDateOptions = (options?: RandomOptions): RandomOptions => {
    return withDefaultRandomOptions({ min: 1_000, max: 1_000_000_000 }, options);
};

const toRandomBinaryOptions = (options?: RandomOptions): RandomOptions => {
    return withDefaultRandomOptions({ min: 1, max: 8124 }, options);
};

const toRandomStringOptions = (options?: RandomStringOptions): RandomStringOptions => {
    const dict = options?.dict ?? (alphabeticDict + numericDict + specialDict);
    return {
        ...toRandomOptions(options),
        dict
    };
};

export const getNumber = (): number => {
    return getNextNumber();
};

export const getString = (): string => {
    return getNextNumber().toString(36);
};

export const getDate = (): Date => {
    return new Date(getNextNumber());
};

export const getRandomNumber = (options?: RandomOptions): number => {
    options = toRandomOptions(options);
    return options.min + Math.random() * (options.max - options.min);
};

export const getRandomInteger = (options?: RandomOptions): number => {
    options = toRandomOptions(options);
    return clamp(Number(getRandomNumber(options).toFixed(0)), options.min, options.max);
};

export const getRandomFloat = (options?: RandomFloatOptions): number => {
    options = toRandomFloatOptions(options);
    return Number(getRandomNumber(options).toFixed(options.precision));
};

export const getBoolean = (): boolean => {
    return Boolean(getRandomInteger() % 2);
}

export const getBooleanWithin = (options?: RandomOptions): boolean => {
    options = toRandomOptions(options);
    return getRandomInteger(options) === options.min;
};

export const getRandomSign = (): number => {
    return getBoolean() ? 1 : -1;
};

const getRandomDateShift = (date: Date, options: RandomOptions, sign: number): Date => {
    return new Date(date.getTime() + sign * getRandomInteger(toRandomDateOptions(options)));
};

export const getRandomDateBefore = (before: Date, options?: RandomOptions): Date => {
    return getRandomDateShift(before, options, -1);
};

export const getRandomDateAfter = (after: Date, options?: RandomOptions): Date => {
    return getRandomDateShift(after, options, 1);
};

export const getRandomPosition = (value: { length: number }): number => {
    return getRandomInteger({ min: 0, max: value.length - 1 });
};

export const getRandomItem = <T>(values: readonly T[]): T => {
    return values[getRandomPosition(values)];
};

export const getRandomArrayOf = <T extends () => any>(generator: T, options?: RandomOptions): (ReturnType<T>)[] => {
    return Array(Math.abs(getRandomInteger(options))).fill('').map(generator);
};

export const getRandomBinary = (options?: RandomBinaryOptions): Uint8Array => {
    options = toRandomBinaryOptions(options);
    return new Uint8Array(
        getRandomArrayOf(
            () => getRandomInteger({ min: options.minChar, max: options.maxChar }),
            options
        )
    );
};

export const getRandomBuffer = (options?: RandomBinaryOptions): Buffer => {
    return Buffer.from(getRandomBinary(options));
};

export const getRandomBase64 = (options?: RandomBinaryOptions): string => {
    return getRandomBuffer(options).toString('base64');
}

export const getRandomString = (options?: RandomStringOptions): string => {
    options = toRandomStringOptions(options)
    const e = '';
    return (
        options.dict.length
            ? Array(Math.abs(getRandomInteger(options)))
                .fill(e)
                .reduce((a) => a + options.dict[getRandomPosition(options.dict)], e)
            : e
    );
};

export const getRandomAlphabeticString = (options?: RandomStringOptions): string => {
    options = toRandomStringOptions(options)
    options.dict = alphabeticDict;
    return getRandomString(options);
};

export const getRandomNumericString = (options?: RandomStringOptions): string => {
    options = toRandomStringOptions(options)
    options.dict = numericDict;
    return getRandomString(options);
};

export const getRandomEmptyString = (options?: RandomStringOptions): string => {
    options = toRandomStringOptions(options)
    options.dict = '  \r\t\n';
    return getRandomString(options);
};

const getRandomURIScheme = (): string => {
    return getRandomItem(protocolsDict);
};

const getRandomURIHost = (): string => {
    return getRandomArrayOf(
        () => getRandomAlphabeticString({ min: 1, max: 5 }),
        {
            min: 1,
            max: 3
        }
    ).join('.') + '.' + getRandomAlphabeticString({ min: 2, max: 5 });
};

const getRandomURIUserInfo = (): string => {
    return getRandomArrayOf(
        () =>
            getRandomAlphabeticString({ min: 1, max: 1 }) +
            getRandomString({ min: 0, max: 10 }) +
            getRandomAlphabeticString({ min: 1, max: 1 }),
        {
            min: 1,
            max: 5
        }
    ).join('.');
};

const getRandomURIPath = (): string => {
    return getRandomArrayOf(
        () => getRandomAlphabeticString({ min: 1, max: 20 }),
        {
            min: 1,
            max: 5
        }
    ).join('/');
};

export const getRandomEmail = (options?: RandomEmailOptions): string => {
    const userinfo = options?.userinfo ?? getRandomURIUserInfo();
    const host = options?.host ?? getRandomURIHost();
    return (
        `${
            userinfo
        }@${
            host
        }`
    );
};

export const getRandomUrl = (options?: RandomURLOptions): string => {
    const scheme = options?.scheme ?? getRandomURIScheme();
    const host = options?.host ?? getRandomURIHost();
    const port = options?.port ?? 0;
    const path = options?.path ?? getRandomURIPath();
    const query = options?.query ?? '';
    const fragment = options?.fragment ?? '';

    return (
        `${
            scheme
        }://${
            host
        }${
            port
            ?
                ':' + port
            : ''
        }${
            path
            ?
                (
                    path.startsWith('/')
                        ? ''
                        : '/'
                ) + path
            : '/'
        }${
            query
            ?
                (
                    query.startsWith('?')
                        ? ''
                        : '?'
                ) + query
            : ''
        }${
            fragment
            ?
                (
                    fragment.startsWith('#')
                        ? ''
                        : '#'
                ) + fragment
            : ''
        }`
    );
};

export const fixture = Object.freeze({
    getBoolean,
    getBooleanWithin,
    getDate,
    getNumber,
    getRandomAlphabeticString,
    getRandomArrayOf,
    getRandomBase64,
    getRandomBinary,
    getRandomBuffer,
    getRandomDateAfter,
    getRandomDateBefore,
    getRandomEmail,
    getRandomEmptyString,
    getRandomFloat,
    getRandomInteger,
    getRandomItem,
    getRandomNumber,
    getRandomNumericString,
    getRandomPosition,
    getRandomSign,
    getRandomString,
    getRandomUrl,
    getString,
    alphabeticDict,
    numericDict,
    specialDict,
});
