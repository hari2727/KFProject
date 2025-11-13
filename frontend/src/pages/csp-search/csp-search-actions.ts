import { KfFilterMetadata } from '@kf-products-core/kfhub_lib';
import { OpEnum } from '@kf-products-core/kfhub_thcl_lib';
import { GroupSelectItem, SelectItem } from '@kf-products-core/kfhub_thcl_lib/transform';
import { createAction, props } from '@ngrx/store';

import { CspSearchFilterEnum } from './csp-search-constants';
import { CspSearch, CspSearchSortableColumn } from './csp-search-model';

export const actionSearchSp = createAction(
    '[Csp] search',
    props<{
        searchTerm: string;
        appliedFilters: KfFilterMetadata[];
        sorting: CspSearchSortableColumn[];
        pageIndex: number;
        pageSize: number;
    }>()
);


export const actionSearchSpSuccess = createAction(
    '[Csp] search Success',
    props<{
        sps?: CspSearch[];
        paging?: {
            pageIndex: number;
            pageSize: number;
            totalPages: number;
            totalResultRecords: number;
        };
    }>()
);

export const actionDeleteSp = createAction(
    '[Csp] delete',
    props<{ id: number }>()
);

export const actionDeleteSpSuccess = createAction(
    '[Csp] delete Success',
    props<{ id: number }>()
);

export const actionStoreFilter = createAction(
    '[Csp Search] Store Filter',
    props<{
        filters: { [type: string]: _.Dictionary<_.Dictionary<string>> | _.Dictionary<string> };
    }>()
);

export const actionSearchChange = createAction(
    '[Csp Search] Search Change',
    props<{
        search: string;
    }>()
);

export const actionFilterQuery = createAction(
    `[Csp Search Filters] ${OpEnum.QUERY_MANY}`,
    props<{
        excludeFilters: CspSearchFilterEnum[] | null,
        apiCallNeeded?: boolean;
    }>()
);

export const actionFilterChange = createAction(
    '[Csp Search] Filter Change',
    // eslint-disable-next-line no-spaced-func
    props<{
        filters: Array<{
            type: CspSearchFilterEnum[];
            term: string;
            items: (SelectItem<string> | GroupSelectItem)[];
        }> | null;
    }>()
);

export const actionFilterRemoveAll = createAction(
    `[Csp Search Filters] ${OpEnum.REMOVE_ALL}`,
);
