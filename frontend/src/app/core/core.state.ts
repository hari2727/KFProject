import {
    getInitStateFromLocalStorageReducer, RouterStateUrl
} from '@kf-products-core/kfhub_thcl_lib/state';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducerMap, createFeatureSelector, MetaReducer } from '@ngrx/store';
import { localeReducer, LocaleState } from './effects/core.reducers';

export const reducers: ActionReducerMap<AppState> = {
    router: routerReducer,
    locale: localeReducer,
};

export const metaReducers: MetaReducer<AppState>[] = [
    getInitStateFromLocalStorageReducer('TARC')
];

export const selectRouterState = createFeatureSelector<AppState, RouterReducerState<RouterStateUrl>>('router');

export interface AppState {
    router: RouterReducerState<RouterStateUrl>;
    locale: LocaleState;
}
