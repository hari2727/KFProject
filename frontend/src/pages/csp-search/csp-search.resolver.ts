import * as _ from 'lodash';
import { forkJoin } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { KfAuthService } from '@kf-products-core/kfhub_lib';
import { select, Store } from '@ngrx/store';

import { actionFilterQuery, actionSearchChange } from './csp-search-actions';
import { CspSearchFilterEnum } from './csp-search-constants';
import { FiltersState } from './csp-search-reducer';
import { selectFilters, selectSearch } from './csp-search-selectors';
import { State } from './csp-search-state';

@Injectable()
export class CSpSearchResolver  {

    constructor(
        private authService: KfAuthService,
        private store: Store<State>,
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const hasGradeAccess = this.authService.getPermissions()?.hasGradeAccess;

        const search = route.queryParamMap.get('search');
        const urlparam = state.url;
        const tarcSearch = urlparam ? true : false;
        if (!_.isNil(search)) {
            this.store.dispatch(actionSearchChange({ search }));
        }

        this.store.pipe(select(selectFilters), filter(f => _.isNil(f)), take(1)).subscribe(() => {
            if(tarcSearch) {
                this.store.dispatch(actionFilterQuery({ excludeFilters: hasGradeAccess ? [] : [CspSearchFilterEnum.Grades], apiCallNeeded:false }));
            }else{
                this.store.dispatch(actionFilterQuery({ excludeFilters: hasGradeAccess ? [] : [CspSearchFilterEnum.Grades], apiCallNeeded:true }));
            }
        });

        return forkJoin([
            this.store.pipe(select(selectSearch), filter(f => !_.isNil(f)), take(1)),
            this.store.pipe(select(selectFilters), filter(f => !_.isNil(f)), take(1))
        ]);
    }
}