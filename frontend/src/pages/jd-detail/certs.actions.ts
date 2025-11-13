import { OpEnum } from '@kf-products-core/kfhub_thcl_lib';
import { createAction, props } from '@ngrx/store';
import { Cert, CertSection } from './jd-detail.model';

export const actionMoveCert = createAction(
    '[Jd Detail] Cert Move',
    props<{ code: string; currentIndex: number; previousIndex: number }>()
);

export const actionUpsertCert = createAction(
    '[Jd Detail] Cert Upsert',
    props<{ cert: Cert }>()
);

export const actionUpsertCerts = createAction(
    '[Jd Detail] Certs Upsert',
    props<{ certs: Cert[] }>()
);

export const actionRemoveCert = createAction(
    '[Jd Detail] Cert Remove',
    props<{ code: string }>()
);

export const actionClearCerts = createAction(
    '[Jd Detail] Certs Clear',
);

export const actionSectionChange = createAction(
    '[Jd Detail] Cert Section Change',
    props<{ section: { hideSection?: boolean; hideNames?: boolean } }>()
);

export const actionCertsQuery = createAction(
    `[Jd Detail] Cert ${OpEnum.QUERY_MANY}`,
    props<{ jdId: number }>()
);

export const actionCertsQuerySuccess = createAction(
    `[Jd Detail] Cert ${OpEnum.QUERY_MANY_SUCCESS}`,
    props<{ section: CertSection }>()
);

export const actionCertsSaveUpdateMany = createAction(
    `[Jd Detail] Cert ${OpEnum.SAVE_ADD_MANY}`,
    props<{ jdId: number; section: CertSection }>()
);

export const actionCertsSaveUpdateManySuccess = createAction(
    `[Jd Detail] Cert ${OpEnum.SAVE_ADD_MANY_SUCCESS}`,
);
