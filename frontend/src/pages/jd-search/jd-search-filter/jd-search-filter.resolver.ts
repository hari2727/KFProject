import * as _ from 'lodash';
import { forkJoin } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { actionFilterQuery } from '../jd-search.actions';
import { FiltersState } from '../jd-search.reducer';
import { selectFilters, selectSearch } from '../jd-search.selectors';
import { State } from '../jd-search.state';

@Injectable()
export class JdSearchFilterResolver  {

    constructor(
        private store: Store<State>,
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this.store.dispatch(actionFilterQuery());

        return forkJoin([
            this.store.pipe(select(selectSearch), filter(f => !_.isNil(f)), take(1)),
            this.store.pipe(select(selectFilters), filter(f => !_.isNil(f)), take(1))
        ]);
    }
}
