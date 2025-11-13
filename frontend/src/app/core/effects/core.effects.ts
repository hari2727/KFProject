import { Injectable } from '@angular/core';
import { KfAuthService, KfTranslationService } from '@kf-products-core/kfhub_lib';
import { LoadStatusEnum } from '@kf-products-core/kfhub_thcl_lib';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, filter, switchMap, map, withLatestFrom, forkJoin } from 'rxjs';
import { actionLocaleLoading, actionLocaleQuery, actionLocaleQuerySuccess } from './core.actions';
import { Store, select } from '@ngrx/store';
import { selectLocale } from './core.selectors';
import { AppState } from '../core.state';

@Injectable()
export class CoreEffects {
    public constructor(
        private actions$: Actions,
        private translationService: KfTranslationService,
        private authService: KfAuthService,
        private store: Store<AppState>,
    ) { }

    public localeQuery = createEffect(() => this.actions$.pipe(
        ofType(actionLocaleQuery),
        withLatestFrom(
            this.store.pipe(select(selectLocale)),
        ),
        tap(() => this.store.dispatch(actionLocaleLoading())),
        filter(([action, localeState]) => localeState.loadStatus !== LoadStatusEnum.LOADING),
        switchMap(([action, localeState]) =>
            forkJoin([
                this.translationService.use(action.locale).toPromise(),
                this.authService.setPreferences([{ productId: action.languagePreferenceId, userDefault: action.locale}]),
                this.translationService.saveLocale(action.locale),
                Promise.resolve(action.locale),
            ]).pipe(
                map(([locale, arg2, arg3, arg4]) => actionLocaleQuerySuccess({ locale: arg4 }))
            )),
    ));
}
