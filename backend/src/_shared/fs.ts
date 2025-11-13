import { join } from 'node:path';
import { readFileSync } from 'node:fs';

export const tryPathUp = (fileName: string, cb: (f: string) => any, maxDepth: number = 20): any => {
    for (let i = 0; i <= Math.abs(maxDepth); i++) {
        const relativePath = join(...new Array(i).fill('..'), fileName);
        try {
            return cb(relativePath);
        } catch (e) {
        }
    }
    return undefined;
};

export const tryRequire = (fileName: string, maxDepth: number = 20): any => {
    return tryPathUp(fileName, require, maxDepth);
};

export const readFileSyncOrThrow = (fileName: string, message?: string): any => {
    try {
        return readFileSync(fileName);
    } catch (e: any) {
        throw new Error(message ?? `Cannot read ${fileName}`);
    }
};
