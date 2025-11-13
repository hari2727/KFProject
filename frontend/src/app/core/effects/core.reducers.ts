import { LoadStatusEnum } from '@kf-products-core/kfhub_thcl_lib';
import { createReducer, on } from '@ngrx/store';
import { actionLocaleLoading, actionLocaleQuerySuccess } from './core.actions';


export const localeState = {
    locale: 'en',
    loadStatus: LoadStatusEnum.NOT_LOADED,
};

export type LocaleState = typeof localeState;

export const localeReducer = createReducer(
    localeState,
    on(actionLocaleLoading, (state) => ({ ...state, loadStatus: LoadStatusEnum.LOADING })),
    on(actionLocaleQuerySuccess, (state, { locale }) => ({ ...state, locale, loadStatus: LoadStatusEnum.LOADED })),
);

export declare enum LocaleEnum {
    DEFAULT = 'en'
}
