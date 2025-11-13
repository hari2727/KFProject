/* eslint-disable max-classes-per-file */

import { JdSearchColumns } from './jd-search.model';


export enum SortColumn {
    JobTitle = 'JOB_TITLE',
    Levels = 'LEVELS',
    Functions = 'FUNCTIONS',
    CreatedBy = 'CREATED_BY',
    ModifiedOn = 'MODIFIED_ON',
}

export const menuTerms = [
    'pm.viewJobDescription',
    'pm.editJobDescription',
    'pm.successProfileDownload',
    'pm.copyJobDescription',
    'pm.removeJobDescriptionText'
];

export const jdColumnSource: JdSearchColumns = {
    name: {
        id: 'name',
        title: 'lib.name',
        sortBy: undefined,
        sortColumn: SortColumn.JobTitle,
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
export const jdColumns: string[] = ['name', 'level', 'function', 'createdBy', 'date', 'menu'];

export enum JdSearchFilterEnum {
    Levels = 'LEVELS',
    Functions = 'FUNCTIONS',
}

export const SEARCH_JD = 'SEARCH_JOBS_MY_DESCRIPTIONS';

