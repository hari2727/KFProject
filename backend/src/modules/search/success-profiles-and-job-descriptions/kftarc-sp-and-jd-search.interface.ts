import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString, } from 'class-validator';
import { QueryProps } from '../../../common/common.interface';
import { options } from '../../../common/common.utils';
import { toNumber } from '../../../_shared/convert';

export enum SortColumn {
    'JOB_TITLE',
    'GRADES',
    'LEVELS',
    'FUNCTIONS',
    'CREATED_BY',
    'MODIFIED_ON',
    '',
}

export enum EntityType {
    SEARCH_SUCCESS_PROFILES ='SEARCH_SUCCESS_PROFILES',
    SEARCH_JOBS_MY_DESCRIPTIONS = 'SEARCH_JOBS_MY_DESCRIPTIONS',
    SEARCH_MY_ORG_PROFILES = 'SEARCH_MY_ORG_PROFILES',
}

export enum SearchColumn {
    'JOB_TITLE',
}

export enum SortByValues {
    'asc',
    'desc',
    'ASC',
    'DESC',
    '',
}

export enum FilterCategories {
    PROFILE_TYPE = 'PROFILE_TYPE',
    GRADES = 'GRADES',
    LEVELS = 'LEVELS',
    FUNCTIONS = 'FUNCTIONS',
    SUBFUNCTIONS = 'SUBFUNCTIONS',
    SEARCH_SOURCE = 'SEARCH_SOURCE',
    INDUSTRY = 'INDUSTRY',
    LANGUAGE = 'LANGUAGE',
    NO_CATEGORY = '',
    PROFILE_COLLECTIONS = 'PROFILE_COLLECTIONS',
    PROFILE_COLLECTION_IDS = 'PROFILE_COLLECTION_IDS',
    KF_ROLE_LEVEL = 'KF_ROLE_LEVEL',
}

export namespace KfTarcSpAndJdSearchRouteDetails {
    export const KfTarcSpAndJdBaseRoute = 'successprofiles';
    export const KfTarcSpAndJdSearchRoute = '/search';

    export class QueryParams extends QueryProps.Default {
        @IsNotEmpty()
        @IsEnum(EntityType)
        type: EntityType;

        @IsNotEmpty()
        @IsEnum(SearchColumn)
        searchColumn: SearchColumn;

        @IsString()
        @IsOptional()
        searchString: string;

        @IsString()
        @IsOptional()
        filterBy: string;

        @IsString()
        @IsOptional()
        filterValues: string;

        @IsString()
        @IsOptional()
        sortColumn: string;

        @IsString()
        @IsOptional()
        sortBy: string;

        @Transform(toNumber, options)
        pageIndex: number;

        @Transform(toNumber, options)
        pageSize: number;

        preferredClientId?: number;
    }
}

export class KfTarcSpAndJdSearchParams {
    clientId: number;
    sectionProductId: number;
    sortColumns: string;
    sortOrders: string;
    searchString: string;
    profileCollections: string = null;
    profileCollectionId: number = null;
    roleLevel: number = null;
    functions: string = null;
    subFunctions: string = null;
    grades: string = null;
    levels: string = null;
    profileTypes: string = null;
    industries: string = null;
    createdBy: string = null;
    locale: string = null;
    pageIndex: number;
    pageSize: number;
    userId: number;
}

export enum PreparedFilterValuesMapper {
    PROFILE_TYPE = 'profileTypes',
    GRADES = 'grades',
    LEVELS = 'levels',
    FUNCTIONS = 'functions',
    SUBFUNCTIONS = 'subFunctions',
    SEARCH_SOURCE = 'createBy',
    INDUSTRY = 'industries',
    LANGUAGE = 'language',
    PROFILE_COLLECTIONS = 'profileCollections',
    PROFILE_COLLECTION_IDS = 'profileCollectionId',
    KF_ROLE_LEVEL = 'roleLevel',
}

export interface PreparedFilterValues {
    profileTypes?: string;
    grades?: string;
    levels?: string;
    functions?: string;
    subFunctions?: string;
    createBy?: string;
    industries?: string;
    language?: string;
    profileCollections?: string;
    profileCollectionId?: string;
    roleLevel?: string;
}
export interface PreparedSortsAndFilters extends PreparedFilterValues {
    sortColumns: string;
    sortOrders: string;
}
export enum ProductId {
    'SEARCH_SUCCESS_PROFILES' = 1,
    'SEARCH_MY_ORG_PROFILES' = 1,
    'SEARCH_JOBS_MY_DESCRIPTIONS' = 2,
}

export namespace KfTarcSpAndJdSpResponse {
    export interface ExportDetails {
        exportStatus: SPExportStatus;
        exportDate: number | null;
    }

    export enum SPExportStatus {
        NOT_DOWNLOADED = 0,
        DOWNLOADED = 1,
        DOWNLOADED_MODIFIED = 2,
    }
    export enum SourceType {
        CREATED_BY = 'CREATED_BY',
        LAST_MODIFIED_BY = 'LAST_MODIFIED_BY',
    }
    export interface Source {
        id: number;
        type: SourceType;
        firstName: string;
        lastName: string;
        effectiveDateTime: number;
    }

    export interface Grade {
        standardHayGrade: number;
        min?: string;
        max?: string;
        customGrades?: {
            grades: {
                gradeLabel: string;
            }[];
        };
    }

    export interface SpAndJd {
        id: number;
        title: string;
        description: string;
        isArchitectJob: boolean;
        levelName: string;
        familyName: string;
        subFamilyName: string;
        status: string;
        isProfileInProfileCollection: boolean;
        isTemplateJob: boolean;
        profileType: string;
        jobRoleTypeId: string;
        enableProfileMatchTool: boolean;
        totalPoints: number;
        shortProfile: string;
        clientIndustryId: number;
        grade: Grade;
        jrtDetailId: string;
        source: Source[];
        exportDetails?: ExportDetails
        jobCode: string;
    }

    export interface Paging {
        pageIndex: number;
        pageSize: number;
        totalPages: number;
        totalResultRecords: number;
    }

    export interface MappedAndCountedDbResponse {
        jobs: SpAndJd[];
        totalRecords: number;
    }

    export interface Response {
        jobs: SpAndJd[];
        paging: Paging;
    }
}
