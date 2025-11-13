import * as _ from 'lodash';
import { forkJoin, Observable } from 'rxjs';
import { concatMap, filter, map, take, tap, withLatestFrom } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { KfISuccessProfile } from '@kf-products-core/kfhub_lib';
import { KfThclSuccessprofileService, LoadStatusEnum } from '@kf-products-core/kfhub_thcl_lib';
import { select, Store } from '@ngrx/store';

import { HttpService } from '../../app/services/http.service';
import { actionCertsQuery } from './certs.actions';
import { selectCerts, selectCertsLoadStatus } from './certs.selectors';
import { selectJd, selectJdLoadStatus } from './jd-detail.selectors';
import { State } from './jd-detail.state';

@Injectable()

export class JdDetailEditResolver  {
    constructor(
        private spService: KfThclSuccessprofileService,
        private httpService: HttpService,
        private store: Store<State>,
        private router: Router

    ) { }

    jdSelectPipeline = this.store.pipe(
        select(selectJd),
        withLatestFrom(this.store.pipe(select(selectJdLoadStatus))),
        filter(([sp, status]) => status === LoadStatusEnum.LOADED),
        map(([sp, status]) => sp),
        take(1)
    );

    certsSelectPipeline = (jdId: number) => this.store.pipe(
        select(selectCerts),
        withLatestFrom(this.store.pipe(select(selectCertsLoadStatus))),
        tap(([certs, status]) => {
            if (status === LoadStatusEnum.NOT_LOADED) {
                this.store.dispatch(actionCertsQuery({ jdId }));
            }
        }),
        filter(([certs, status]) => status === LoadStatusEnum.LOADED),
        map(([certs, status]) => certs),
        take(1)
    );

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const getOriginalParentId = this.router.getCurrentNavigation();
        const isNewJd = route.params.jdDetailId === 'new';
        const isCopyJd = route.queryParams.copy === 'true';
        const sourceJdId = _.toNumber(route.queryParams.sourceJdId || 0);

        if (isNewJd) {
            return forkJoin([
                this.jdSelectPipeline,
                this.httpService.getUniversalCompanyDesc(),
                this.certsSelectPipeline(_.toNumber(route.queryParams.fromSPId)),
            ]);
        }
        const jdId = _.toNumber(route.params.jdDetailId);
        return forkJoin([
            this.jdSelectPipeline,
            this.jdSelectPipeline.pipe(concatMap((jd) => this.spService.getSuccessProfileDetail(jdId, false, false, true))),
            isCopyJd
                ? this.jdSelectPipeline.pipe(concatMap((jd) => this.certsSelectPipeline(sourceJdId ? sourceJdId : jd.parentJobDetails.id)))
                : this.certsSelectPipeline(jdId)
        ]);
    }
}
