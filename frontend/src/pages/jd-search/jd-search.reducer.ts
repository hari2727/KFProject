import { GroupSelectItem, SelectItem } from '@kf-products-core/kfhub_thcl_lib/transform';
import { createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import * as jdSearchActions from './jd-search.actions';
import { JdSearchFilterEnum } from './jd-search.constant';
import { JdSearch } from './jd-search.model';

export const adapter = createEntityAdapter<JdSearch>();
export const jdInitialState = adapter.getInitialState<{ pageIndex: number; totalResultRecords: number }>({
    pageIndex: undefined,
    totalResultRecords: undefined,
});
export type JdsState = typeof jdInitialState;


export const jdsReducer = createReducer(
    jdInitialState,
    on(jdSearchActions.actionSearchJdSuccess, (state, payload) => {
        const { pageIndex, totalResultRecords } = payload.paging;
        const updatedState = { ...state, pageIndex, totalResultRecords };

        return adapter.upsertMany(payload.jds, updatedState);
    }),
);

export type FiltersState = Array<{
    type: JdSearchFilterEnum[];
    term: string;
    items: (SelectItem<string> | GroupSelectItem)[];
}>;

export const filterInitialState: FiltersState = undefined;

export const filtersReducer = createReducer(
    filterInitialState,
    on(jdSearchActions.actionFilterQuerySuccess, (state, payload) => {
        const { filters } = payload;

        const updatedState = filters;

        return updatedState;
    }),
    on(jdSearchActions.actionFilterRemoveAll, (state, payload) => undefined),
);

export const selectedFilterInitialState = undefined;

export const selectedFiltersReducer = createReducer(
    selectedFilterInitialState,
    on(jdSearchActions.actionFilterChange, (state, payload) => {
        const { filters } = payload;
        const updatedState = filters;

        return updatedState;
    }),
);

export const searchInitialState = undefined;

export const searchReducer = createReducer(
    searchInitialState,
    on(jdSearchActions.actionSearchChange, jdSearchActions.actionFilterQuerySuccess, (state, payload) => {
        const { search } = payload;
        const updatedState = search;

        return updatedState;
    }),
);

