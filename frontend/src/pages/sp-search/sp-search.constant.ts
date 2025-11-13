/* eslint-disable max-classes-per-file */

import { SpSearchColumns, SpSearchWorkdayColumns } from './sp-search.model';


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

export const columnSource: SpSearchColumns = {
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
        title: 'lib.grade',
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
        title: 'lib.date',
        sortBy: undefined,
        sortColumn: SortColumn.ModifiedOn,
    },
};
// SP-12311 type column is removed
export const columns: string[] = ['name', 'grade', 'level', 'function', 'createdBy', 'date', 'menu'];


export const workdayColumnSource: SpSearchWorkdayColumns = {
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


export enum SpSearchFilterEnum {
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

export enum SpActionItemEnum {
    CreateJD = 'CREATE_JD',
    DownloadPDF = 'DOWNLOAD_PDF',
    CopySP = 'COPY_SP',
    RemoveSP = 'REMOVE_SP',
    CreateAssessmentPrj = 'CREATE_ASSESSMENT_PROJECT',
    ProfileMatchTool = 'MATCH_TOOL',
}


export enum SpSearcColumnEnum {
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

export enum UAMSelectPermissionCodes {
    Management = 'management',
    Managerial = 'managerial',
    Professional = 'professional',
    Potential = 'potential',
    Leadership = 'leadership',
    ProfessionalDevelopment = 'professional development',
    ProfessionalDevelopmentLearningAgility = 'professional   learning agility',
    LeadershipSelection = 'leadership selection',
    PotentialLearningAgility = 'potential   learning agility',
    LeadreshipLearningAgility = 'leadership   learning agility',
    LeadershipAddOn = 'leadership   potential add on',
    LeadershipAddOnLearningAgility = 'leadership   potential add on   learning agility',
}
export const DEFAULT_PAGE_SIZE = 50;
