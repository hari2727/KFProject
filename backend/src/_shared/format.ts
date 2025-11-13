import { getUTCParts } from './date';
import { toStringOr } from './convert';

export const hrFileSize = (bytes: number, dp = 1): string => {
    const thresh = 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    let u = -1;
    const r = 10;
    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + ' ' + units[u];
}

export const hrUTCFormat = (date?: Date): string => {
    const u = getUTCParts(date);
    return [u.splice(0, 3).join('-'), u.join(':'), 'GMT'].join(' ');
}

export const quote = (value: any): string => {
    return `"${toStringOr(value)}"`;
}
