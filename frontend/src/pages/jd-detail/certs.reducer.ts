import { LoadStatusEnum } from '@kf-products-core/kfhub_thcl_lib';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';

import * as certsActions from './certs.actions';
import { Cert } from './jd-detail.model';

export interface CertState extends EntityState<Cert> {
    loadStatus?: LoadStatusEnum;
    hideSection?: boolean;
    hideNames?: boolean;
}

function sortByOrder(a: Cert, b: Cert): number {
    return a.order - b.order;
}
export const certAdapter = createEntityAdapter<Cert>({
    selectId: cert => cert.code,
    sortComparer: sortByOrder,
});
export const certInitialState = certAdapter.getInitialState({
    loadStatus: undefined,
    hideSection: undefined,
    hideNames: undefined,
});


export const certReducer = createReducer(
    certInitialState,
    on(certsActions.actionCertsQuery, (state, payload) => ({ ...state, loadStatus: LoadStatusEnum.LOADING })),
    on(certsActions.actionCertsSaveUpdateMany, (state, payload) => ({ ...state, loadStatus: LoadStatusEnum.SAVING })),
    on(certsActions.actionCertsSaveUpdateManySuccess, (state, payload) => ({ ...state, loadStatus: LoadStatusEnum.SAVED })),
    on(certsActions.actionCertsQuerySuccess, (state, payload) => {

        const { hideSection, hideNames, certs } = payload.section;
        return certAdapter.upsertMany(certs, { ...state, hideSection, hideNames, loadStatus: LoadStatusEnum.LOADED });
    }),

    on(certsActions.actionUpsertCert, (state, payload) => certAdapter.upsertOne(payload.cert, state)),

    on(certsActions.actionUpsertCerts, (state, payload) => certAdapter.upsertMany(payload.certs, state)),

    on(certsActions.actionRemoveCert, (state, payload) => certAdapter.removeOne(payload.code, state)),

    on(certsActions.actionMoveCert, (state, payload) => {
        const { currentIndex, previousIndex } = payload;

        const certs: Cert[] = _.chain(state.ids).map((id: string) => state.entities[id]).value();
        const cert = certs.splice(previousIndex, 1);
        certs.splice(currentIndex, 0, ...cert);

        const updatedCerts = _.chain(certs)
            .map((cert, i) => ({ id: cert.code, changes: { order: i + 1 } }))
            .value();

        return certAdapter.updateMany(updatedCerts, state);
    }),
    on(certsActions.actionClearCerts, (state, payload) => certInitialState),

    on(certsActions.actionSectionChange, (state, payload) => {
        const { section } = payload;
        return { ...state, ...section };
    }),

);
