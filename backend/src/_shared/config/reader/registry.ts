import { ConfigReader } from './reader';

const readers: Map<string, ConfigReader> = new Map();

export const registerConfigReader = (path: string, reader: ConfigReader): boolean => {
    if (!readers.has(path)) {
        readers.set(path, reader);
        return true;
    }
    return false;
};

export const getConfigReader = (path?: string): ConfigReader | undefined => {
    if (path) {
        return readers.get(path);
    }
    return [...readers.values()][0];
};

export const clearConfigReaders = (): void => {
    readers.clear();
};
