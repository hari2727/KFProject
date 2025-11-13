import * as _ from 'lodash';
import { forkJoin } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { KfAuthService } from '@kf-products-core/kfhub_lib';
import { select, Store } from '@ngrx/store';

import { actionFilterQuery, actionSearchChange } from './sp-search.actions';
import { SpSearchFilterEnum } from './sp-search.constant';
import { FiltersState } from './sp-search.reducer';
import { selectFilters, selectSearch } from './sp-search.selectors';
import { State } from './sp-search.state';

@Injectable()
export class SpSearchResolver  {

    constructor(
        private authService: KfAuthService,
        private store: Store<State>,
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const hasGradeAccess = this.authService.getPermissions()?.hasGradeAccess;

        const search = route.queryParamMap.get('search');
        const urlparam = state.url;
        const tarcSearch = urlparam ? true : false;
        const tarcMatrixSearch = urlparam === '/tarc/sp/matrix' ? true : false;
        if (!_.isNil(search)) {
            this.store.dispatch(actionSearchChange({ search }));
        }

        this.store.pipe(select(selectFilters), filter(f => _.isNil(f)), take(1)).subscribe(() => {
            if(tarcSearch || tarcMatrixSearch) {
                this.store.dispatch(actionFilterQuery({ excludeFilters: hasGradeAccess ? [] : [SpSearchFilterEnum.Grades], apiCallNeeded:false }));// entering or clicking filter
            }else{
                this.store.dispatch(actionFilterQuery({ excludeFilters: hasGradeAccess ? [] : [SpSearchFilterEnum.Grades], apiCallNeeded:true }));
            }
        });


        return forkJoin([
            this.store.pipe(select(selectSearch), filter(f => !_.isNil(f)), take(1)),
            this.store.pipe(select(selectFilters), filter(f => !_.isNil(f)), take(1))
        ]);
    }
}
