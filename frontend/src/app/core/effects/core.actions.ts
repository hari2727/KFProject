import { OpEnum as spActions } from '@kf-products-core/kfhub_thcl_lib';
import { createAction, props } from '@ngrx/store';

export const actionLocaleQuery = createAction(
    `[LANG] Locale ${spActions.QUERY_BY_KEY}`,
    props<{
        languagePreferenceId: number;
        locale: string;
    }>(),
);

export const actionLocaleLoading = createAction(
    `[LANG] Locale Loading ${spActions.QUERY_BY_KEY}`,
);

export const actionLocaleQuerySuccess = createAction(
    `[LANG] Locale ${spActions.QUERY_BY_KEY_SUCCESS}`,
    props<{
        locale: string;
    }>(),
);
