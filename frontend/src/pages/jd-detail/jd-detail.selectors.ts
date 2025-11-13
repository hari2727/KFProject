import { createSelector } from '@ngrx/store';

import { selectJdDetail } from './jd-detail.state';

export const selectJd = createSelector(
    selectJdDetail,
    (state) => state.jd.jd
);

export const selectJdLoadStatus = createSelector(
    selectJdDetail,
    (state) => state.jd.loadStatus
);

