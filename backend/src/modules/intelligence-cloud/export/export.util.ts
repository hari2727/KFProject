import { PageColumns, PageData, PageDataResponse } from './export.interface';

export const buildPageDataResponse = (_data: PageData[]): PageDataResponse => {
    const allKeys = [];

    const data: PageData[] = [..._data];

    if (!data.length) {
        data.push({ '': null });
    }

    for (const i of data) {
        allKeys.push(...Object.keys(i));
    }

    const keys = [...(new Set(allKeys))];
    const resp = [];
    for (const i of data) {
        const p = {};
        for (const k of keys) {
            const v = i[k];
            p[k] = v === undefined ? null : v;
        }
        resp.push(p);
    }

    const columns: PageColumns = {};
    for (const k of keys) {
        columns[k] = true;
    }
    (resp as PageDataResponse).columns = columns;

    return resp as PageDataResponse;
}
