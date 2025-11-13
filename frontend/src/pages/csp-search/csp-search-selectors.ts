import { createSelector } from '@ngrx/store';

import { selectCspSearch } from './csp-search-state';

export const selectSelectedFilters = createSelector(
    selectCspSearch,
    (state) => state.selectedFilters
);
export const selectSearch = createSelector(
    selectCspSearch,
    (state) => state.search
);

export const selectFilters = createSelector(
    selectCspSearch,
    (state) => state.filters
);

