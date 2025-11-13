import { KfFilterMetadata } from '@kf-products-core/kfhub_lib';
import { OpEnum } from '@kf-products-core/kfhub_thcl_lib';
import { GroupSelectItem, SelectItem } from '@kf-products-core/kfhub_thcl_lib/transform';
import { createAction, props } from '@ngrx/store';

import { JdSearchFilterEnum } from './jd-search.constant';
import { JdSearch, JdSearchSortableColumn } from './jd-search.model';

export const actionSearchJd = createAction(
    '[Jd] search',
    props<{
        searchTerm: string;
        appliedFilters: KfFilterMetadata[];
        sorting: JdSearchSortableColumn[];
        pageIndex: number;
        pageSize: number;
    }>()
);


export const actionSearchJdSuccess = createAction(
    '[Jd] search Success',
    props<{
        jds?: JdSearch[];
        paging?: {
            pageIndex: number;
            pageSize: number;
            totalPages: number;
            totalResultRecords: number;
        };
    }>()
);

export const actionDeleteJd = createAction(
    '[Jd] delete',
    props<{ id: number }>()
);

export const actionDeleteJdSuccess = createAction(
    '[Jd] delete Success',
    props<{ id: number }>()
);

export const actionFilterChange = createAction(
    '[Jd Search] Filter Change',
    props<{
        filters: { [type: string]: _.Dictionary<_.Dictionary<string>> | _.Dictionary<string> };
    }>()
);

export const actionSearchChange = createAction(
    '[Jd Search] Search Change',
    props<{
        search: string;
    }>()
);

export const actionFilterQuery = createAction(
    `[Jd Search Filters] ${OpEnum.QUERY_MANY}`,
);

export const actionFilterQuerySuccess = createAction(
    `[Jd Search Filters] ${OpEnum.QUERY_MANY_SUCCESS}`,
    // eslint-disable-next-line no-spaced-func
    props<{
        search: string;
        filters: {
            type: JdSearchFilterEnum[];
            term: string;
            items: (SelectItem<string> | GroupSelectItem)[];
        }[];
    }>()
);

export const actionFilterRemoveAll = createAction(
    `[Jd Search Filters] ${OpEnum.REMOVE_ALL}`,
);
