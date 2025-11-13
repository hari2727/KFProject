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

import { CspSearchFilterEnum, SortColumn } from './csp-search-constants';

export class NameCell {
    text: string;
    icon: string;
    href: string;
}

export class ExportDetailsCell {
    exportStatus: number;
    exportDate: string;
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

export class CspSearch {
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
    exportDetails?: ExportDetailsCell;
    jobCode?: string;
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
    status: string;
    jobCode?: string;
}

export class CspSearchSortableColumn extends SortableColumn<SortColumn> { }

export class CspSearchColumns {
    name: CspSearchSortableColumn;
    type: Column;
    grade: CspSearchSortableColumn;
    level: CspSearchSortableColumn;
    function: CspSearchSortableColumn;
    createdBy: CspSearchSortableColumn;
    date: CspSearchSortableColumn;
    status: CspSearchSortableColumn;
}
export class CspSearchWorkdayColumns {
    jobCode: CspSearchSortableColumn;
    status: CspSearchSortableColumn;
    lastPublished: CspSearchSortableColumn;
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
    type: CspSearchFilterEnum;
    label: string;
    value: string;
    parentId: string;
}

export interface CspSearchContextMenuProps {
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

export interface PcColumn {
    key?: string;
    label?: string;
}

export interface PublishCenterData {
    exportID: string;
    exportedOn: string;
    type: string;
    exportedBy: string;
    numberOfProfiles: number;
    status: 'COMPLETED' | 'PENDING' | 'FAILED';
    LCID: string;
    name: string;
}

export interface PcApiResponse {
    results: PublishCenterData[];
    total: number; // Total number of records available
}

export interface ExportedProfile {
    limit: number;
    page: string;
    results: ExportedProfileResult[];
    total: number;
}
export interface ExportedProfileResult {
    GenerateHCMIntDownloadID: string;
    ClientJobID: string;
    JobName: string;
    ModifiedOn: string;
    ModifiedBy: string;
    JobCode: string;
    ModifiedByName: string;
}