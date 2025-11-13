import { GroupSelectItem, SelectItem } from '@kf-products-core/kfhub_thcl_lib/transform';
import { createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';

import * as spSearchActions from './sp-search.actions';
import { SpSearchFilterEnum } from './sp-search.constant';
import { SpSearch } from './sp-search.model';

export const adapter = createEntityAdapter<SpSearch>();
export const spInitialState = adapter.getInitialState<{ pageIndex: number; totalResultRecords: number }>({
    pageIndex: undefined,
    totalResultRecords: undefined,
});
export type SpsState = typeof spInitialState;


export const spsReducer = createReducer(
    spInitialState,
    on(spSearchActions.actionSearchSpSuccess, (state, payload) => {
        const { pageIndex, totalResultRecords } = payload.paging;
        const updatedState = { ...state, pageIndex, totalResultRecords };

        return adapter.upsertMany(payload.sps, updatedState);
    }),
);

export type FiltersState = Array<{
    type: SpSearchFilterEnum[];
    term: string;
    items: (SelectItem<string> | GroupSelectItem)[];
}>;

export const filterInitialState: FiltersState = undefined;

export const filtersReducer = createReducer(
    filterInitialState,
    on(spSearchActions.actionFilterChange, (state, payload) => {
        const { filters } = payload;

        if (!state) {
            return filters;
        }

        const filterDict = _.chain(filters).map(f => [f.term, f]).fromPairs().value();

        const updatedState = state.map(filter => {
            if (filterDict[filter.term]) {
                filter = filterDict[filter.term];
            }
            return filter;
        });

        return updatedState;
    }),
    on(spSearchActions.actionFilterRemoveAll, (state, payload) => undefined),
);

export const selectedFilterInitialState = undefined;

export const selectedFiltersReducer = createReducer(
    selectedFilterInitialState,
    on(spSearchActions.actionStoreFilter, (state, payload) => {
        const { filters } = payload;
        const updatedState = filters;

        return updatedState;
    }),
);

export const searchInitialState = '';

export const searchReducer = createReducer(
    searchInitialState,
    on(spSearchActions.actionSearchChange, (state, payload) => {
        const { search } = payload;
        const updatedState = search;

        return updatedState;
    }),
);

