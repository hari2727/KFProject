import { QueryProps } from '../../common/common.interface';
import { SearchColumn } from '../search/success-profiles-and-job-descriptions/kftarc-sp-and-jd-search.interface';

export enum EntityType {
    CAREER_ARCHITECTURE_VIEW = 'CAREER_ARCHITECTURE_VIEW',
    CAREER_ARCHITECTURE_VIEW_EXPORT = 'CAREER_ARCHITECTURE_VIEW_EXPORT',
}

export namespace KfTarcSpMatrixRequestDetails {
    export const ROUTE = '/matrix';

    export interface QueryParams extends QueryProps.Default {
        type: EntityType;
        searchColumn: SearchColumn;
        searchString: string;
        filterBy: string;
        filterValues: string;
        sortColumn: string;
        sortBy: string;
        pageIndex?: string;
        pageSize?: string;
    }
}

export class KfTarcSpMatrixParams {
    clientId: number;
    sectionProductId: number;
    functions: string;
    subFunctions: string;
    profileTypes: string;
    createdBy: string;
    locale: string;
    pageIndex: number;
    pageSize: number;
    userId: number;
}

export enum FilterCategories {
    PROFILE_TYPE = 'PROFILE_TYPE',
    FUNCTIONS = 'FUNCTIONS',
    SUBFUNCTIONS = 'SUBFUNCTIONS',
    SEARCH_SOURCE = 'SEARCH_SOURCE',
    LANGUAGE = 'LANGUAGE',
    NO_CATEGORY = '',
    PROFILE_COLLECTIONS = 'PROFILE_COLLECTIONS',
}

export interface PreparedFilterValues {
    profileTypes?: string;
    functions?: string;
    subFunctions?: string;
    createdBy?: string;
    language?: string;
    profileCollections?: string;
}

export enum PreparedFilterValuesMapper {
    PROFILE_TYPE = 'profileTypes',
    FUNCTIONS = 'functions',
    SUBFUNCTIONS = 'subFunctions',
    SEARCH_SOURCE = 'createdBy',
    LANGUAGE = 'language',
    PROFILE_COLLECTIONS = 'profileCollections',
}

export class KfTarcSpMatrixProfilesParams {
    clientId: number;
    sectionProductId: number;
    functions: string;
    subFunctions: string;
    profileTypes: string;
    createdBy: string;
    locale: string;
    pageIndex: number;
    pageSize: number;
    userId: number;
    profileCollections: string;
}

export interface SpMatrixJob {
    id: number;
    name: string;
    shortProfile: string;
    standardHayGrade: string;
    profileType: string;
    levelName: string;
    subLevelName: string;
    isExecutive: boolean;
    totalPoints: number;
    customGrades?: {
        grades: { gradeLabel: string }[];
    };
}

export interface SpMatrixProfileJobRole {
    profileType: string;
    jobRoleTypeId: string;
    name: string;
    totalSuccessProfiles: number;
    grades?: { value: number }[];
    level?: { value: string }[];
    subLevel?: { value: string }[];
    shortProfile?: { value: string }[];
    jobs?: SpMatrixJob[];
}

export interface SpMatrixProfileJobSubFamily {
    id: string;
    name: string;
    jobRoles: SpMatrixProfileJobRole[];
}

export interface SpMatrixProfileJobFamily {
    id: string;
    name: string;
    insights: {
        totalSubFamilies: number;
        totalJobRoles: number;
        totalSuccessProfiles: number;
    };
    jobSubFamilies: Map<string, SpMatrixProfileJobSubFamily>;
}

export namespace KfTarcSpMatrixResponse {
    export interface SpMatrixJob {
        id: number;
        name: string;
        shortProfile: string;
        standardHayGrade: string;
        profileType: string;
        levelName: string;
        subLevelName: string;
        isExecutive: boolean;
        totalPoints: number;
        customGrades?: { grades: { gradeLabel: string }[] };
        min?: string;
        max?: string;
    }

    export interface SpMatrixProfileJobRole {
        profileType: string;
        jobRoleTypeId: string;
        name: string;
        totalSuccessProfiles: number;
        grades?: { value: number, min: string, max: string }[];
        level?: { value: string }[];
        subLevel?: { value: string }[];
        shortProfile?: { value: string }[];
        jobs?: SpMatrixJob[];
        jobId: string;
        isExecutive: boolean;
    }

    export interface SpMatrixProfileJobSubFamily {
        id: string;
        name: string;
        jobRoles: SpMatrixProfileJobRole[];
    }

    export interface SpMatrixProfileJobFamily {
        id: string;
        name: string;
        insights: {
            totalSubFamilies: number;
            totalJobRoles: number;
            totalSuccessProfiles: number;
        };
        jobSubFamilies: SpMatrixProfileJobSubFamily[];
    }
    export interface Paging {
        pageIndex: number;
        pageSize: number;
        totalPages: number;
        totalResultRecords: number;
    }
    export interface Response {
        jobFamilies: SpMatrixProfileJobFamily[];
        paging: Paging;
    }
}
