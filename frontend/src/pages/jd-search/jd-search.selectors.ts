import { createSelector } from '@ngrx/store';

import { selectJdSearch } from './jd-search.state';

export const selectSelectedFilters = createSelector(
    selectJdSearch,
    (state) => state.selectedFilters
);
export const selectSearch = createSelector(
    selectJdSearch,
    (state) => state.search
);

export const selectFilters = createSelector(
    selectJdSearch,
    (state) => state.filters
);

