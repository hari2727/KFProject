import { catchError, map, tap, withLatestFrom, mergeMap, switchMap, filter } from 'rxjs/operators';

/* eslint-disable arrow-body-style */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { selectCerts, selectCertsLoadStatus } from './certs.selectors';

import {
    KfTarcJobDescriptionService
} from '../../app/modules/services/kftarc-job-description.service';
import { HttpService } from '../../app/services/http.service';
import {
    actionCertsQuery, actionCertsQuerySuccess, actionCertsSaveUpdateMany,
    actionCertsSaveUpdateManySuccess
} from './certs.actions';
import { actionJdQuery, actionJdQuerySuccess } from './jd-detail.actions';
import { State } from './jd-detail.state';
import { LoadStatusEnum } from '@kf-products-core/kfhub_thcl_lib';

@Injectable()
export class JdDetailEffects {

    jdQuery = createEffect(() => {
        return this.actions$.pipe(
            ofType(actionJdQuery),
            switchMap((action) => {
                return this.jdService.getSuccessProfileDetail(action.id, false).pipe(
                    map(jd => {
                        return actionJdQuerySuccess({ jd });
                    }),
                );
            })
        );
    });

    certsQuery = createEffect(() => {
        return this.actions$.pipe(
            ofType(actionCertsQuery),
            withLatestFrom(this.store.pipe(select(selectCertsLoadStatus))),
            filter(([certs, status]) => status !== LoadStatusEnum.SAVING),
            switchMap(([action]) => {
                return this.httpService.getCerts(action.jdId).pipe(
                    mergeMap(section => {
                        return [actionCertsQuerySuccess({ section })];
                    })
                );
            })
        );
    });

    certsSaveUpdateMany = createEffect(() => {
        return this.actions$.pipe(
            ofType(actionCertsSaveUpdateMany),
            switchMap((action) => {
                return this.httpService.updateCerts(action.jdId, action.section).pipe(
                    mergeMap(section => {
                        return [actionCertsSaveUpdateManySuccess()];
                    })
                );
            })
        );
    });

    constructor(
        private jdService: KfTarcJobDescriptionService,
        private httpService: HttpService,
        private actions$: Actions,
        private store: Store<State>,
    ) { }
}
