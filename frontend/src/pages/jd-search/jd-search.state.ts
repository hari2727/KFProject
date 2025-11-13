import { getInitStateFromLocalStorageReducer } from '@kf-products-core/kfhub_thcl_lib/state';
import { ActionReducerMap, createFeatureSelector, MetaReducer } from '@ngrx/store';
import { AppState } from '../../app/core/core.state';
import {
    filtersReducer, FiltersState, searchReducer, selectedFiltersReducer
} from './jd-search.reducer';


export const FEATURE_NAME = 'jdSearch';

export const metaReducers: MetaReducer<JdSearchState>[] = [
    getInitStateFromLocalStorageReducer('TARC', FEATURE_NAME)
];

export const selectJdSearch = createFeatureSelector<State, JdSearchState>(
    FEATURE_NAME
);
export const reducers: ActionReducerMap<JdSearchState> = {
    filters: filtersReducer,
    selectedFilters: selectedFiltersReducer,
    search: searchReducer
};

export interface JdSearchState {
    filters: FiltersState;
    selectedFilters: { [type: string]: _.Dictionary<string> };
    search: string;
}


export interface State extends AppState {
    jdSearch: JdSearchState;
}
