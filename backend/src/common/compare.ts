const extractSubsets = (value: any): any[] =>
    (value && typeof value === 'string')
        ? value.match(/(\d+\.)?\d+|\D+/g).map(i => !/^(\d+\.)?\d+$/.test(i) ? String(i) : parseInt(i, 10))
        : [value === null ? null : value];

const groupSubsets = (a: any[], b: any[]): any[][] => {
    const r = [];
    while (a.length || b.length) {
        r.push([a.shift(), b.shift()]);
    }
    return r;
};

export const compareAlphaNumericSubsets = (a: any, b: any): number => {
    let c: number = 0;
    for (const [ai, bi] of groupSubsets(extractSubsets(a), extractSubsets(b))) {
        if (typeof ai === 'number' && typeof bi === 'number') {
            c = ai - bi;
        } else if (typeof ai === 'number' || !bi) {
            c = -1;
        } else if (typeof bi === 'number' || !ai) {
            c = 1;
        } else {
            // @ts-ignore
            c = String(ai).localeCompare(bi);
        }
        if (c) {
            break;
        }
    }
    return c;
};
