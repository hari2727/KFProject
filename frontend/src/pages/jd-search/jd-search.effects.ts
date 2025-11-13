/* eslint-disable arrow-body-style */
import { Injectable } from '@angular/core';
import { KfFilterMetadata } from '@kf-products-core/kfhub_lib';
import { LocalStorageService } from '@kf-products-core/kfhub_thcl_lib/persistence';
import { parseFilterPipedParams } from '@kf-products-core/kfhub_thcl_lib/utils';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { selectRouterState } from '../../app/core/core.state';
import { KfTarcJobDescriptionService } from '../../app/modules/services/kftarc-job-description.service';
import {
    actionFilterChange, actionFilterQuery, actionFilterQuerySuccess, actionSearchChange
} from './jd-search.actions';
import { mapJdSearchFilters } from './jd-search.pure';
import { selectSearch, selectSelectedFilters } from './jd-search.selectors';
import { FEATURE_NAME, State } from './jd-search.state';


@Injectable()
export class JdSearchEffects {

    filterQuery = createEffect(() => {
        return this.actions$.pipe(
            ofType(actionFilterQuery),
            withLatestFrom(
                this.store.pipe(select(selectSelectedFilters)),
                this.store.pipe(select(selectSearch)),
                this.store.select(selectRouterState),
            ),
            switchMap(([action, storageFilters, storageSearch, router]) => this.jdService.getMetadata().pipe(
                map(res => {
                    let { search, filterBy, filterValues } = router.state.queryParams;

                    let parsedFilters;
                    if (!_.isEmpty(filterBy) && !_.isEmpty(filterValues)) {
                        parsedFilters = parseFilterPipedParams(filterBy, filterValues);
                        this.localStorageService.setItem('selectedFilters', parsedFilters, FEATURE_NAME);
                    }
                    if (!_.isNil(search)) {
                        this.localStorageService.setItem('search', search, FEATURE_NAME);
                    }

                    const filters = mapJdSearchFilters(res[0].searchOn as KfFilterMetadata[], _.isNil(parsedFilters) ? storageFilters : parsedFilters);

                    return actionFilterQuerySuccess({ filters, search: !_.isNil(search) ? search : storageSearch || '' });
                })
            ))
        );
    });

    filterChange = createEffect(
        () => this.actions$.pipe(
            ofType(actionFilterChange),
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
        public jdService: KfTarcJobDescriptionService,
        private actions$: Actions,
        private store: Store<State>,
        private localStorageService: LocalStorageService
    ) { }
}
