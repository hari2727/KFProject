/* eslint-disable max-classes-per-file */

import _ from 'lodash';
import { CspSearchColumns, CspSearchWorkdayColumns, PcColumn } from './csp-search-model';

export enum SortColumn {
    JobTitle = 'JOB_TITLE',
    JobCode = 'JOB_CODE',
    Status = 'STATUS',
    Grades = 'GRADES',
    Levels = 'LEVELS',
    Functions = 'FUNCTIONS',
    CreatedBy = 'CREATED_BY',
    LastPublished = 'LAST_PUBLISHED',
    ModifiedOn = 'MODIFIED_ON',
}

export const menuTerms = [
    'pm.successProfileCopySuccessProfile',
    'pm.successProfileCreateNewJobDescription',
    'pm.successProfileDownload',
    'pm.successProfileRemoveSuccessProfile',
    'pm.successProfileCreateAssessmentProject',
    'pm.useProfileMatchTool'
];

export const columnSource: CspSearchColumns = {
    name: {
        id: 'name',
        title: 'lib.name',
        sortBy: undefined,
        sortColumn: SortColumn.JobTitle,
    },
    type: {
        id: 'type',
        title: 'lib.PROFILE_TYPE',
    },
    grade: {
        id: 'grade',
        title: 'kf grade',
        sortBy: undefined,
        sortColumn: SortColumn.Grades,
    },
    level: {
        id: 'level',
        title: 'lib.level',
        sortBy: undefined,
        sortColumn: SortColumn.Levels,
    },
    function: {
        id: 'function',
        title: 'lib.function',
        sortBy: undefined,
        sortColumn: SortColumn.Functions,
    },
    createdBy: {
        id: 'createdBy',
        title: 'lib.createdBy',
        sortBy: undefined,
        sortColumn: SortColumn.CreatedBy,
    },
    date: {
        id: 'date',
        title: 'lib.lastModified',
        sortBy: undefined,
        sortColumn: SortColumn.ModifiedOn,
    },
    status: {
        id: 'status',
        title: 'lib.STATUS',
        sortBy: undefined,
        sortColumn: SortColumn.Status,
    },
};
// SP-12311 type column is removed
export const columns: string[] = ['name', 'grade', 'level', 'function', 'createdBy', 'date', 'status', 'menu'];


export const workdayColumnSource: CspSearchWorkdayColumns = {
    jobCode: {
        id: 'jobCode',
        title: 'lib.jobCode',
        sortBy: undefined,
        sortColumn: SortColumn.JobCode,
    },
    status: {
        id: 'status',
        title: 'lib.status',
        sortBy: undefined,
        sortColumn: SortColumn.Status,
    },
    lastPublished: {
        id: 'lastPublished',
        title: 'lib.lastPublished',
        sortBy: undefined,
        sortColumn: SortColumn.LastPublished,
    },
};
export const workdayColumns: string[] = ['jobCode', 'status', 'lastPublished'];


export enum CspSearchFilterEnum {
    SearchSource = 'SEARCH_SOURCE',
    Grades = 'GRADES',
    ProfileType = 'PROFILE_TYPE',
    Industry = 'INDUSTRY',
    Levels = 'LEVELS',
    Functions = 'FUNCTIONS',
    SubFunctions = 'SUBFUNCTIONS',
    Language = 'LANGUAGE',
    ProfileCollections = 'PROFILE_COLLECTIONS',
}

export const SEARCH_SP = 'SEARCH_SUCCESS_PROFILES';

export enum CspActionItemEnum {
    CreateJD = 'CREATE_JD',
    DownloadPDF = 'DOWNLOAD_PDF',
    CopySP = 'COPY_SP',
    RemoveSP = 'REMOVE_SP',
    CreateAssessmentPrj = 'CREATE_ASSESSMENT_PROJECT',
    ProfileMatchTool = 'MATCH_TOOL',
}


export enum CspSearcColumnEnum {
    Name = 'name',
    Grade = 'grade',
    Level = 'level',
    Function = 'function',
    CreatedBy = 'createdBy',
    Date = 'date',
    Menu = 'menu'
}

export enum ProductTypeEnum {
    Assess = 'TALENT_MANAGEMENT',
    Select = 'TALENT_ACQUISITION'
}


export function getEncodedQuery(
    page = 1,
    limit = 10,
    sortColumn = '',
    sortOrder = '',
    type = '',
) {
    const query = {
        sortColumn,
        sortOrder,
        type,
    };
    if (!_.isNil(page) && !_.isNil(limit)) {
        _.assign(query, { page, limit });
    }

    return new URLSearchParams(query).toString();
}

export const PublishCenterColumnsEnum: PcColumn[] = [
    { key: 'numberOfProfiles', label: 'pm.noOfProfiles' },
    { key: 'name', label: 'pm.accessedBy' },
    { key: 'exportedOn', label: 'pm.accessedDate' },
    { key: 'type', label: 'pm.actionTaken' },
    { key: 'status', label: 'pm.status' }
];

export enum SortDirectionEnum {
    Ascending = 'asc',
    Descending = 'desc'
}

export enum ProfileType {
    export = 'export',
    download = 'download'
}

export const exportedJobcolumnSource: PcColumn[] = [
    { key: 'NAME', label: 'pm.name' },
    { key: 'JOB CODE', label: 'pm.JobCode' },
    { key: 'MODIFIED BY', label: 'pm.modifiedBy' },
    { key: 'LAST MODIFIED', label: 'pm.lastModified' },
];