import { createSelector } from '@ngrx/store';
import { AppState } from '../core.state';

export const selectLocale = createSelector(
    (state: AppState) => state,
    (state) => state.locale,
);
