/* eslint-disable max-classes-per-file */

import { KfIJobFactor, KfIProjectBundle, KfISpSource } from '@kf-products-core/kfhub_lib';
import { Column, SortableColumn, SpGrade, SpTypeEnum } from '@kf-products-core/kfhub_thcl_lib/domain';
// import { Option } from '@kf-products-core/kfhub_thcl_lib/transform';
interface Option {
    id: string;
    value: string;
    name?: string;
    type?: string;
    description?: string;
    order?: number;
}

import { SpSearchFilterEnum, SortColumn } from './sp-search.constant';

export class NameCell {
    text: string;
    icon: string;
    href: string;
}

export class MenuCell {
    id: number;
    title: string;
    accessRoles: string;
    source: {
        type: string;
        id: number;
    }[];
    grade: SpGrade;
    profileType: string;
    jobRoleTypeId: string;
    totalPoints: number;
    standardHayGrade: number;
    enableProfileMatchTool: boolean;
    isArchitectJob: boolean;
}

export class SpSearch {
    id: number;
    title: string;
    levelName: string;
    familyName: string;
    grade: SpGrade;
    accessRoles: string;
    source: KfISpSource[];
    profileType: SpTypeEnum;
    jobRoleTypeId: string;
    totalPoints: number;
    enableProfileMatchTool: boolean;
    shortProfile: string;
    clientIndustryId: number;
    isArchitectJob: boolean;
}

export class SpSearchRow {
    id: number;
    name: NameCell;
    type: string;
    grade: string;
    level: string;
    function: string;
    createdBy: string;
    date: string;
    menu: MenuCell;
}

export class CspSearchRow {
    id: number;
    name: NameCell;
    type: string;
    grade: string;
    level: string;
    function: string;
    createdBy: string;
    date: string;
    menu: MenuCell;
    isSelected?: boolean;
}

export class SpSearchSortableColumn extends SortableColumn<SortColumn> { }

export class SpSearchColumns {
    name: SpSearchSortableColumn;
    type: Column;
    grade: SpSearchSortableColumn;
    level: SpSearchSortableColumn;
    function: SpSearchSortableColumn;
    createdBy: SpSearchSortableColumn;
    date: SpSearchSortableColumn;
}
export class SpSearchWorkdayColumns {
    jobCode: SpSearchSortableColumn;
    status: SpSearchSortableColumn;
    lastPublished: SpSearchSortableColumn;
}

type MenuAction = (id: number, title?: string, jobRoleTypeId?: string, isArchitectJob?: boolean) => void;

export class MenuItem {
    label: string;
    action: MenuAction;
    actionType: string;
    isDisabled?: boolean;
}

export interface SelectItemFlatten {
    term: string;
    type: SpSearchFilterEnum;
    label: string;
    value: string;
    parentId: string;
}

export interface SpSearchContextMenuProps {
    id?: number;
    title?: string;
    jobRoleTypeId?: string;
    jobFactors?: KfIJobFactor[];
    productTypes?: KfIProjectBundle[];
    isArchitectJob?: boolean;
}

export interface FilterOption extends Option {
    options?: Option[];
}

export interface EditPermission {
    permissionId: string;
    permissionName: string;
}

export interface ProductLineSubComponent {
    countryCode: string;
    id: string;
    name: string;
    access: string;
}

export interface SelectAssessProducts {
    componentId: string;
    name: string;
    access: string;
    permissionId: string;
    subText: string;
    expiredProduct: string;
    options: EditPermission[];
    productLineSubComponent: ProductLineSubComponent[];
}

export interface SelectAssessResponse {
    user: User;
}

export interface User {
    productLine: ProductLine[];
}

export interface ProductLine {
    countries: Country[];
}

export interface Country {
    countryId: string;
    countryCode: string;
    countryName: string;
    access: string;
    product: Product[];
}

export interface Product {
    componentId: string;
    name: string;
    access: string;
    permissionId: string;
    subText: string;
    expiredProduct: string;
    option: EditPermission;
    productLineSubComponent: ProductLineSubComponentRes[];
}
export interface ProductLineSubComponentRes {
    countryCode: string | null;
    subComponentId: string;
    name: string;
    access: string;
    id: string;
}

export enum SelectAssessProductIdsEnum {
    Select = 2,
    Assess = 3,
}

export enum SelectAssessProductTypeEnum {
    Assess = 'Assess',
    Select = 'Select'
}

export enum SelectAssessProductIdEnum {
    ProductId = 'productId'
}
