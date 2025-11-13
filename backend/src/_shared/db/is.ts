import { toDateOr } from '../convert';

const datetimeLow = new Date(1753, 0, 1);
const datetimeHigh = new Date(9999, 11, 31);

export const isSqlDatetime = (value: any): boolean => {
    const d = toDateOr(value);
    return d && d < datetimeHigh && d > datetimeLow;
}
