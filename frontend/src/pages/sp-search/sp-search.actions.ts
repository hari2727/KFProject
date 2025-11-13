import { KfFilterMetadata } from '@kf-products-core/kfhub_lib';
import { OpEnum } from '@kf-products-core/kfhub_thcl_lib';
import { GroupSelectItem, SelectItem } from '@kf-products-core/kfhub_thcl_lib/transform';
import { createAction, props } from '@ngrx/store';

import { SpSearchFilterEnum } from './sp-search.constant';
import { SpSearch, SpSearchSortableColumn } from './sp-search.model';

export const actionSearchSp = createAction(
    '[Sp] search',
    props<{
        searchTerm: string;
        appliedFilters: KfFilterMetadata[];
        sorting: SpSearchSortableColumn[];
        pageIndex: number;
        pageSize: number;
    }>()
);


export const actionSearchSpSuccess = createAction(
    '[Sp] search Success',
    props<{
        sps?: SpSearch[];
        paging?: {
            pageIndex: number;
            pageSize: number;
            totalPages: number;
            totalResultRecords: number;
        };
    }>()
);

export const actionDeleteSp = createAction(
    '[Sp] delete',
    props<{ id: number }>()
);

export const actionDeleteSpSuccess = createAction(
    '[Sp] delete Success',
    props<{ id: number }>()
);

export const actionStoreFilter = createAction(
    '[Sp Search] Store Filter',
    props<{
        filters: { [type: string]: _.Dictionary<_.Dictionary<string>> | _.Dictionary<string> };
    }>()
);

export const actionSearchChange = createAction(
    '[Sp Search] Search Change',
    props<{
        search: string;
    }>()
);

export const actionFilterQuery = createAction(
    `[Sp Search Filters] ${OpEnum.QUERY_MANY}`,
    props<{
        excludeFilters: SpSearchFilterEnum[] | null,
        apiCallNeeded?: boolean;
    }>()
);

export const actionFilterChange = createAction(
    '[Sp Search] Filter Change',
    props<{
        filters: Array<{
            type: SpSearchFilterEnum[];
            term: string;
            items: (SelectItem<string> | GroupSelectItem)[];
        }> | null;
    }>()
);

export const actionFilterRemoveAll = createAction(
    `[Sp Search Filters] ${OpEnum.REMOVE_ALL}`,
);
