import * as _ from 'lodash';
import { combineLatest, forkJoin, Observable } from 'rxjs';
import { filter, map, take, tap, withLatestFrom } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { KfISuccessProfile } from '@kf-products-core/kfhub_lib';
import { select, Store } from '@ngrx/store';

import { actionJdQuery } from './jd-detail.actions';
import { selectJd, selectJdLoadStatus } from './jd-detail.selectors';
import { State } from './jd-detail.state';
import { LoadStatusEnum } from '@kf-products-core/kfhub_thcl_lib';
import { selectCerts, selectCertsLoadStatus } from './certs.selectors';
import { actionCertsQuery } from './certs.actions';

@Injectable()

export class JdDetailResolver  {
    constructor(
        private store: Store<State>,
    ) { }

    jdSelectPipeline = (id: number) => combineLatest([
        this.store.pipe(select(selectJd)),
        this.store.pipe(select(selectJdLoadStatus)),
    ]).pipe(
        tap(([sp, status]) => {
            if (status === LoadStatusEnum.NOT_LOADED || status === LoadStatusEnum.LOADED) {
                this.store.dispatch(actionJdQuery({ id }));
            }
        }),
        filter(([sp, status]) => status === LoadStatusEnum.LOADED && sp.id === id),
        map(([sp, status]) => sp),
        take(1)
    );


    certsSelectPipeline = (jdId: number) => this.store.pipe(
        select(selectCerts),
        withLatestFrom(this.store.pipe(select(selectCertsLoadStatus))),
        tap(([certs, status]) => {
            if (status === LoadStatusEnum.NOT_LOADED || status === LoadStatusEnum.LOADED) {
                this.store.dispatch(actionCertsQuery({ jdId }));
            }
        }),
        filter(([certs, status]) => status === LoadStatusEnum.LOADED),
        map(([certs, status]) => certs),
        take(1)
    );

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const id = _.toNumber(route.params.jdDetailId);
        if (id) {
            return forkJoin([this.jdSelectPipeline(id), this.certsSelectPipeline(id)]);
        }

        return null;
    }
}
