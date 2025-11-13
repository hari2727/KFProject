export const oj = (value: any): void =>
    console.log(jj(value));

export const jj = (value: any): string =>
    JSON.stringify(value, null, 4);
