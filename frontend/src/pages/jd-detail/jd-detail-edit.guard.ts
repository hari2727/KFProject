import * as _ from 'lodash';
import { filter, map, take, tap, withLatestFrom } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { KfAuthService } from '@kf-products-core/kfhub_lib';
import { select, Store } from '@ngrx/store';

import { State } from './jd-detail.state';
import { selectJd, selectJdLoadStatus } from './jd-detail.selectors';
import { actionJdQuery } from './jd-detail.actions';
import { Observable } from 'rxjs';
import { LoadStatusEnum } from '@kf-products-core/kfhub_thcl_lib';

@Injectable()
export class JdDetailEditGuard  {

    constructor(
        public authService: KfAuthService,
        public router: Router,
        private store: Store<State>,
    ) { }

    jdSelectPipeline = (id: number) => this.store.pipe(
        select(selectJd),
        withLatestFrom(this.store.pipe(select(selectJdLoadStatus))),
        tap(([sp, status]) => {
            if (status === LoadStatusEnum.NOT_LOADED || sp.id !== id) {
                this.store.dispatch(actionJdQuery({ id }));
            }
        }),
        filter(([sp, status]) => status === LoadStatusEnum.LOADED && sp.id === id),
        map(([sp, status]) => sp),
        take(1)
    );

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const isNewJd = route.params.jdDetailId === 'new';

        const id = isNewJd ? _.toNumber(route.queryParams.fromSPId) : _.toNumber(route.params.jdDetailId);

        return this.jdSelectPipeline(id).pipe(
            map(j => this.isAdmin() || this.isOwner(j.id) || this.hasRole(j, 'EDIT') || isNewJd)
        );
    }

    canDeactivate(component: { canDeactivate: () => boolean | Observable<boolean> }) {
        return component.canDeactivate();
    }

    private isAdmin(): boolean {
        const user = this.authService.getSessionInfo().User;

        return user && user.IsAdmin;
    }

    public isOwner(jobId: number): boolean {
        const user = this.authService.getSessionInfo().User;

        return jobId > 0 && user.UserId === jobId;
    }

    public hasRole(job: { accessRoles?: string; profileType?: string; isTemplateJob?: boolean }, role: 'EDIT'): boolean {
        if (!job.accessRoles || !job.profileType) {
            return false;
        }
        return job.accessRoles.includes(role) && !job.isTemplateJob;
    }
}
