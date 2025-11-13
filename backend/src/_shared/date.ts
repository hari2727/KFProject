export const getUTCParts = (date?: Date): string[] => {
    const d = date || new Date();
    return [
        d.getUTCFullYear(),
        d.getUTCMonth() + 1,
        d.getUTCDate(),
        d.getUTCHours(),
        d.getMinutes(),
        d.getUTCSeconds()
    ].map(n => String(n).padStart(2, '0'));
}

export const getUTCTimeStamp = (date?: Date): string =>
    getUTCParts(date).join('');
