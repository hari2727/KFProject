import { KfISpSubCategory, KfISuccessProfile } from '@kf-products-core/kfhub_lib';
import { OpEnum } from '@kf-products-core/kfhub_thcl_lib';
import { SecCodeEnum } from '@kf-products-core/kfhub_thcl_lib/domain';
import { createAction, props } from '@ngrx/store';

export const actionJdQuery = createAction(
    `[Jd Detail] ${OpEnum.QUERY_BY_KEY}`,
    props<{ id: number }>()
);

export const actionJdQuerySuccess = createAction(
    `[Jd Detail] ${OpEnum.QUERY_BY_KEY_SUCCESS}`,
    props<{ jd: KfISuccessProfile }>()
);

export const actionJdRemove = createAction(
    `[Jd Detail] ${OpEnum.REMOVE_ONE}`,
);

export const actionUpdateSubCtg = createAction(
    `[Jd Detail] SubCtg ${OpEnum.UPDATE_ONE}`,
    props<{ subCtg: KfISpSubCategory; sectionCode: SecCodeEnum }>()
);
export const actionUpdateSubCtgs = createAction(
    `[Jd Detail] SubCtg ${OpEnum.UPDATE_MANY}`,
    props<{ subCtgs: KfISpSubCategory[]; sectionCode: SecCodeEnum }>()
);
export const actionRemoveSubCtg = createAction(
    `[Jd Detail] SubCtg ${OpEnum.REMOVE_ONE}`,
    props<{ subCtgId: number; sectionCode: SecCodeEnum }>()
);
export const actionMoveSubCtg = createAction(
    '[Jd Detail] SubCtg Move',
    props<{ subCtgId: number; sectionCode: SecCodeEnum; currentIndex: number; previousIndex: number }>()
);


export const actionSectionItemValueRemove = createAction(
    '[Jd Detail] Item Deep Remove One',
    props<{ sectionCode: SecCodeEnum; path: Array<string | number> }>()
);
export const actionSectionItemValueChange = createAction(
    `[Jd Detail] Item ${OpEnum.UPDATE_ONE}`,
    props<{ value: any; sectionCode: SecCodeEnum; path: Array<string | number> }>()
);
export const actionJobFieldValueChange = createAction(
    `[Jd Detail] Job Field ${OpEnum.UPDATE_ONE}`,
    props<{ value: any; path: Array<string | number>; unset?: boolean }>()
);
export const actionRemoveItem = createAction(
    `[Jd Detail] Item ${OpEnum.REMOVE_ONE}`,
    props<{ sectionCode: SecCodeEnum; index: number; field: 'tasks' | 'toolsCommodities' }>()
);
export const actionMoveFlattenListItem = createAction(
    '[Jd Detail] Item Move',
    props<{ sectionCode: SecCodeEnum; currentIndex: number; previousIndex: number; field: 'tasks' | 'toolsCommodities' }>()
);
