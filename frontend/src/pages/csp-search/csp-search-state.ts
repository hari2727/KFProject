import { getInitStateFromLocalStorageReducer } from '@kf-products-core/kfhub_thcl_lib/state';
import { ActionReducerMap, createFeatureSelector, MetaReducer } from '@ngrx/store';

import { AppState } from '../../app/core/core.state';
import { filtersReducer, FiltersState, searchReducer, selectedFiltersReducer } from './csp-search-reducer';

export const FEATURE_NAME = 'cspSearch';

export const metaReducers: MetaReducer<CspSearchState>[] = [
    getInitStateFromLocalStorageReducer('TARC', FEATURE_NAME)
];

export const selectCspSearch = createFeatureSelector<State, CspSearchState>(
    FEATURE_NAME
);
export const reducers: ActionReducerMap<CspSearchState> = {
    filters: filtersReducer,
    selectedFilters: selectedFiltersReducer,
    search: searchReducer
};

export interface CspSearchState {
    filters: FiltersState;
    selectedFilters: { [type: string]: _.Dictionary<_.Dictionary<string>> | _.Dictionary<string> };
    search: string;
}


export interface State extends AppState {
    cspSearch: CspSearchState;
}
