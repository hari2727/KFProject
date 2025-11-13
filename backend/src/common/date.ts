export const toSqlFormat = (date?: Date): string =>
    (date || new Date()).toISOString().slice(0, 19).replace('T', ' ');
