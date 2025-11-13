/* eslint-disable arrow-body-style */
import * as _ from 'lodash';
import { map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { KfFilterMetadata } from '@kf-products-core/kfhub_lib';
import { KfThclSuccessprofileService } from '@kf-products-core/kfhub_thcl_lib';
import { LocalStorageService } from '@kf-products-core/kfhub_thcl_lib/persistence';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';

import { selectRouterState } from '../../app/core/core.state';
import { HttpService } from '../../app/services/http.service';
import {
    actionStoreFilter, actionFilterQuery, actionSearchChange, actionFilterChange
} from './sp-search.actions';
import { mapSpSearchFilters } from './sp-search.pure';
import { selectSearch, selectSelectedFilters } from './sp-search.selectors';
import { FEATURE_NAME, State } from './sp-search.state';

// import { parseFilterPipedParams } from '@kf-products-core/kfhub_thcl_lib/utils';

@Injectable()
export class SpSearchEffects {

    filterQuery = createEffect(() => {
        return this.actions$.pipe(
            ofType(actionFilterQuery),
            withLatestFrom(
                this.store.pipe(select(selectSelectedFilters)),
                this.store.pipe(select(selectSearch)),
                this.store.pipe(select(selectRouterState)),
            ),
            switchMap(([action, storageFilters, storageSearch, router]) => this.httpService.spSearchMetadata(action.apiCallNeeded).pipe(
                mergeMap(res => {
                    // let { search, filterBy, filterValues } = router.state.queryParams;

                    // let parsedFilters;
                    // if (!_.isEmpty(filterBy) && !_.isEmpty(filterValues)) {
                    //     // parsedFilters = parseFilterPipedParams(filterBy, filterValues);
                    //     // this.localStorageService.setItem('selectedFilters', parsedFilters, FEATURE_NAME);
                    // }
                    // if (!_.isNil(search)) {
                    //     // this.localStorageService.setItem('search', search, FEATURE_NAME);
                    // }
                    let filters =[]
                    if(res.length > 0) {
                     filters = mapSpSearchFilters(res[0].searchOn as KfFilterMetadata[], action.excludeFilters, storageFilters);
                    } 
                    return [actionSearchChange({ search: storageSearch }), actionFilterChange({ filters })];
                })
            ))
        );
    });

    filterChange = createEffect(
        () => this.actions$.pipe(
            ofType(actionStoreFilter),
            tap((action) => {
                this.localStorageService.setItem('selectedFilters', action.filters, FEATURE_NAME);
            })
        ),
        { dispatch: false }
    );

    searchChange = createEffect(
        () => this.actions$.pipe(
            ofType(actionSearchChange),
            tap((action) => {
                this.localStorageService.setItem('search', action.search, FEATURE_NAME);
            })
        ),
        { dispatch: false }
    );

    constructor(
        public httpService: HttpService,
        public spService: KfThclSuccessprofileService,
        private actions$: Actions,
        private store: Store<State>,
        private localStorageService: LocalStorageService
    ) { }
}
