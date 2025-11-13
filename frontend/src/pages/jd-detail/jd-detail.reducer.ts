import * as _ from 'lodash';

import { KfISuccessProfile } from '@kf-products-core/kfhub_lib';
import { LoadStatusEnum } from '@kf-products-core/kfhub_thcl_lib';
import {
    getSubCtg, moveSubCtg, removeSubCtg, updateSubCtg
} from '@kf-products-core/kfhub_thcl_lib/domain';
import { createReducer, on } from '@ngrx/store';

import * as jdDetailActions from './jd-detail.actions';

export interface JdState {
    jd: KfISuccessProfile;
    loadStatus: LoadStatusEnum;
}

export const jdInitialState: JdState = { jd: undefined, loadStatus: LoadStatusEnum.NOT_LOADED };

export const jdReducer = createReducer(
    jdInitialState,
    on(jdDetailActions.actionJdQuery, (state, payload) => ({ ...state, loadStatus: LoadStatusEnum.LOADING })),
    on(jdDetailActions.actionJdQuerySuccess, (state, payload) => {
        const { jd } = payload;

        return { ...state, jd, loadStatus: LoadStatusEnum.LOADED };
    }),
    on(jdDetailActions.actionRemoveSubCtg, (state, payload) => {
        const { subCtgId, sectionCode } = payload;

        const { jd } = state;
        const changedSp = removeSubCtg(jd, { profileId: jd.id, sectionCode, subCtgId });

        return { ...state, jd: changedSp };
    }),
    on(jdDetailActions.actionMoveSubCtg, (state, payload) => {
        const { subCtgId, sectionCode, currentIndex, previousIndex } = payload;

        const { jd } = state;

        const changedSp = moveSubCtg(jd, { sectionCode, subCtgId, currentIndex }) as KfISuccessProfile;

        return { ...state, jd: changedSp };
    }),
    on(jdDetailActions.actionUpdateSubCtg, (state, payload) => {
        const { sectionCode, subCtg } = payload;

        const { jd } = state;
        let updatedSubCtg = getSubCtg(jd, sectionCode, subCtg.id);

        const { name, description } = subCtg.descriptions[0];
        updatedSubCtg = {
            ...updatedSubCtg,
            descriptions: [{
                ...updatedSubCtg.descriptions[0],
                name,
                description
            }]
        };

        const changedSp = updateSubCtg(jd, { sectionCode, subCtg: updatedSubCtg, profileId: jd.id, subCtgId: subCtg.id });

        return { ...state, jd: changedSp };
    }),
    on(jdDetailActions.actionUpdateSubCtgs, (state, payload) => {
        const { sectionCode, subCtgs } = payload;

        const { jd } = state;

        let changedJd = jd;

        for (const subCtg of subCtgs) {
            const { name, description } = subCtg.descriptions[0];
            let updatedSubCtg = getSubCtg(changedJd, sectionCode, subCtg.id);

            updatedSubCtg = { ...updatedSubCtg, descriptions: [{ ...updatedSubCtg.descriptions[0], name, description }] };

            changedJd = updateSubCtg(changedJd, {
                sectionCode, subCtg: updatedSubCtg, profileId: changedJd.id, subCtgId: subCtg.id,
            });
        }

        return { ...state, jd: changedJd };
    }),
    on(jdDetailActions.actionRemoveItem, (state, payload) => {
        const { index, sectionCode, field } = payload;

        const changedSp = _.cloneDeep(state.jd);
        let section = changedSp.sections.find(s => s.code === sectionCode);

        section[field].splice(index, 1);

        return { ...state, jd: changedSp };
    }),
    on(jdDetailActions.actionMoveFlattenListItem, (state, payload) => {
        const { sectionCode, currentIndex, previousIndex, field } = payload;

        const changedSp = _.cloneDeep(state.jd);
        let section = changedSp.sections.find(s => s.code === sectionCode);

        const item = section[field].splice(previousIndex, 1);
        section[field].splice(currentIndex, 0, ...item);

        return { ...state, jd: changedSp };
    }),
    on(jdDetailActions.actionSectionItemValueChange, (state, payload) => {
        const { value, sectionCode, path } = payload;

        const changedSp = _.cloneDeep(state.jd);
        let section = changedSp.sections.find(s => s.code === sectionCode);

        _.set(section, path, value);

        return { ...state, jd: changedSp };
    }),
    on(jdDetailActions.actionSectionItemValueRemove, (state, payload) => {
        const { sectionCode, path } = payload;

        const changedSp = _.cloneDeep(state.jd);
        let section = changedSp.sections.find(s => s.code === sectionCode);

        _.unset(section, path);

        return { ...state, jd: changedSp };
    }),
    on(jdDetailActions.actionJobFieldValueChange, (state, payload) => {
        const { value, path, unset } = payload;

        const changedSp = _.cloneDeep(state.jd);

        unset ? _.unset(changedSp, path) : _.set(changedSp, path, value);

        return { ...state, jd: changedSp };
    }),
    on(jdDetailActions.actionJdRemove, (state, payload) => jdInitialState),
);

