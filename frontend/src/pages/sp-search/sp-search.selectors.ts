import { createSelector } from '@ngrx/store';

import { selectSpSearch } from './sp-search.state';

export const selectSelectedFilters = createSelector(
    selectSpSearch,
    (state) => state.selectedFilters
);
export const selectSearch = createSelector(
    selectSpSearch,
    (state) => state.search
);

export const selectFilters = createSelector(
    selectSpSearch,
    (state) => state.filters
);

