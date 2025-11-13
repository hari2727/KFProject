import { getInitStateFromLocalStorageReducer } from '@kf-products-core/kfhub_thcl_lib/state';
import { ActionReducerMap, createFeatureSelector, MetaReducer } from '@ngrx/store';
import { AppState } from '../../app/core/core.state';
import { certReducer, CertState } from './certs.reducer';
import { jdReducer, JdState } from './jd-detail.reducer';


export const FEATURE_NAME = 'jdDetail';

export const metaReducers: MetaReducer<JdDetailState>[] = [
    getInitStateFromLocalStorageReducer('TARC', FEATURE_NAME)
];

export const selectJdDetail = createFeatureSelector<State, JdDetailState>(
    FEATURE_NAME
);
export const reducers: ActionReducerMap<JdDetailState> = {
    jd: jdReducer,
    certs: certReducer
};

export interface JdDetailState {
    jd: JdState;
    certs: CertState;
}


export interface State extends AppState {
    jdDetail: JdDetailState;
}
