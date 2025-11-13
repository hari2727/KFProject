/* eslint-disable max-classes-per-file */

import { KfISpSource } from '@kf-products-core/kfhub_lib';
import { Column, SortableColumn, SpGrade, SpTypeEnum } from '@kf-products-core/kfhub_thcl_lib/domain';
// import { Option } from '@kf-products-core/kfhub_thcl_lib/transform';
interface Option {
    id: string;
    value: string;
    name?: string;
}

import { JdSearchFilterEnum, SortColumn } from './jd-search.constant';

export class JdNameCell {
    text: string;
    href: string;
}

export class JdMenuCell {
    id;
    title: string;
    source: {
        type: string;
        id: number;
    }[];
}

// JdSearch is same as SpSearch but SpSearch extra isTemplate and totalPoints
export class JdSearch {
    id: number;
    title: string;
    levelName: string;
    familyName: string;
    grade: {
        standardHayGrade: number;
    };
    accessRoles: string;
    source: KfISpSource[];
    profileType: SpTypeEnum;
    jobRoleTypeId: string;
    totalPoints: number;
    enableProfileMatchTool: boolean;
    shortProfile: string;
    clientIndustryId: number;
}

export class JdSearchRow {
    id: number;
    name: JdNameCell;
    level: string;
    function: string;
    createdBy: string;
    date: string;
    menu: JdMenuCell;
}

export class JdSearchSortableColumn extends SortableColumn<SortColumn> { }

export class JdSearchColumns {
    name: JdSearchSortableColumn;
    level: JdSearchSortableColumn;
    function: JdSearchSortableColumn;
    createdBy: JdSearchSortableColumn;
    date: JdSearchSortableColumn;
}


type MenuAction = (event: MouseEvent, id: number, title?: string, jobRoleTypeId?: string) => void;

export class MenuItem {
    label: string;
    action: MenuAction;
}

export interface SelectItemFlatten {
    term: string;
    type: JdSearchFilterEnum;
    label: string;
    value: string;
    parentId: string;
}

export interface Paging {
    pageIndex: string;
    pageSize: string;
    totalPages: number;
    totalResultRecords: number;
}

export interface FilterOption extends Option {
    options?: Option[];
}
