import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { KfAuthService } from '@kf-products-core/kfhub_lib';
import { Store, select } from '@ngrx/store';

import { Observable, filter, map } from 'rxjs';
import { KfTarcSuccessProfileDetailService } from './kftarc-success-profile-detail.service';
import { actionLocaleQuery } from '../../../../../core/effects/core.actions';
import { AppState } from '../../../../../core/core.state';
import { selectLocale } from '../../../../../core/effects/core.selectors';
import { LoadStatusEnum } from '@kf-products-core/kfhub_thcl_lib';

@Injectable()
export class SpDetailGuard  {

    constructor(
        public authService: KfAuthService,
        public router: Router,
        private spDetailsService: KfTarcSuccessProfileDetailService,
        private store: Store<AppState>,
    ) { }

    canActivate() {
        const access = this.authService.getSessionInfo().User.Permissions;
        const { hasLanguageAccess } = access;

        if (!hasLanguageAccess) {
            return true;
        }

        const localeFromFilter = this.spDetailsService.getLocaleFromFilter();
        if (localeFromFilter && hasLanguageAccess) {
            const languagePreferenceId = 6;
            this.store.dispatch(actionLocaleQuery({
                languagePreferenceId,
                locale: localeFromFilter,
            }));

            return this.store.pipe(
                select(selectLocale),
                filter((localeState) => localeState.loadStatus === LoadStatusEnum.LOADED),
                map((locale) => {
                    if (locale.locale) {
                        return true;
                    }
                    return false;
                }),
            );
        } else {
            return true;
        }
    }

    canDeactivate(component: { canDeactivate: () => boolean | Observable<boolean> }) {
        return component.canDeactivate();
    }
}
