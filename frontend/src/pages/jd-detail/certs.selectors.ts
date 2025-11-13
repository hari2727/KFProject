import { createSelector } from '@ngrx/store';
import { certAdapter } from './certs.reducer';

import { selectJdDetail } from './jd-detail.state';

const { selectAll } = certAdapter.getSelectors();

export const selectCerts = createSelector(
    selectJdDetail,
    state => ({
        certs: selectAll(state.certs),
        hideSection: state.certs.hideSection,
        hideNames: state.certs.hideNames
    })
);

export const selectCertsLoadStatus = createSelector(
    selectJdDetail,
    (state) => state.certs.loadStatus
);
