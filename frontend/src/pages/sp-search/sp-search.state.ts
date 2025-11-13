import { getInitStateFromLocalStorageReducer } from '@kf-products-core/kfhub_thcl_lib/state';
import { ActionReducerMap, createFeatureSelector, MetaReducer } from '@ngrx/store';

import { AppState } from '../../app/core/core.state';
import { filtersReducer, FiltersState, searchReducer, selectedFiltersReducer, spsReducer, SpsState } from './sp-search.reducer';

export const FEATURE_NAME = 'spSearch';

export const metaReducers: MetaReducer<SpSearchState>[] = [
    getInitStateFromLocalStorageReducer('TARC', FEATURE_NAME)
];

export const selectSpSearch = createFeatureSelector<State, SpSearchState>(
    FEATURE_NAME
);
export const reducers: ActionReducerMap<SpSearchState> = {
    // sps: spsReducer,
    filters: filtersReducer,
    selectedFilters: selectedFiltersReducer,
    search: searchReducer
};

export interface SpSearchState {
    // sps: SpsState;
    filters: FiltersState;
    selectedFilters: { [type: string]: _.Dictionary<_.Dictionary<string>> | _.Dictionary<string> };
    search: string;
}


export interface State extends AppState {
    spSearch: SpSearchState;
}
