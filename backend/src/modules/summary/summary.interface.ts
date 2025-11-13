import { QueryProps } from '../../common/common.interface';

export interface DashboarSummaryDataService {
    getSuccessProfiesJobDescriptions(
        query: SummaryQuery,
        pointValue: number,
        sectionProductID: number,
        viewFlag: number,
        modifiedFlag: number,
        createdFlag: number,
        hasPointValueAccess: boolean,
        hasExecutiveAccessByPointValue: boolean,
    ): Promise<SuccessProfilesJobDescriptionsProcResponse>;
    getFunctionData(query: SummaryQuery): Promise<FunctionsProcResponse[]>;
    getLevelsData(query: SummaryQuery): Promise<LevelsProcResponse[]>;
    getDownloadsData(
        query: SummaryQuery,
        hasPointValueAccess: boolean,
        hasExecutiveAccessByPointValue: boolean,
        pointValue: number,
    ): Promise<DownloadProcResponse[]>;
    getUserData(piid: string): Promise<UserDataResponse>;
}

export interface SummaryDashboardResponse {
    downloads?: SummaryDownloads[];
    functions?: SummaryFunctionsData[];
    jobdescriptions?: SuccessProfilesJobDescriptions;
    level?: SummaryLevel;
    successProfiles?: SuccessProfilesJobDescriptions;
}

export interface SummaryDownloads {
    id: number;
    jobExportUrl: string;
    reportType: string;
    title: string;
}

export interface SummaryFunctionsData {
    id: string | number;
    name: string;
    value: number;
}

export interface SuccessProfilesJobDescriptions {
    jobs: SummaryJobs[];
    totalResultRecords: number;
}

export interface SummaryJobs {
    id: number;
    title: string;
    familyName: string;
    subFamilyName: string;
    noOfDependantJobs: number;
    profileType: string;
    managementLabel: string;
    firstName: string;
    lastName: string;
    effectiveDateTime: number;
    type: string;
    jobExportUrl?: string;
    viewedDateTime: number | string;
    parentJobDetails: {
        id: number;
        title: string;
    };
}

export interface SummaryLevel {
    levels: SummaryFunctionsData[];
    totalResultRecords: number;
}

export interface SummaryQuery extends QueryProps.Default {
    type?: FilterType;
    filterBy?: FilterBy;
}

export enum FilterType {
    SUCCESS_PROFILE = 'SUCCESS_PROFILE',
    JOB_DESCRIPTION = 'JOB_DESCRIPTION',
    DEFAULT = 'DEFAULT',
}

export enum FilterBy {
    RECENTLY_MODIFIED = 'RECENTLY_MODIFIED',
    RECENTLY_VIEWED = 'RECENTLY_VIEWED',
    RECENTLY_CREATED = 'RECENTLY_CREATED',
}

export enum FilterByType {
    LAST_MODIFIED_BY = 'LAST_MODIFIED_BY',
    CREATED_BY = 'CREATED_BY',
}

export enum ProfileType {
    SUCCESS_PROFILE = 1,
    JOB_DESCRIPTION = 2,
}

export interface SummaryValues {
    isExecutivePointValueAccess: number;
    accessPoints: number;
    accessResCondition: string;
}

export interface DownloadProcResponse {
    ClientJobID: string;
    JobName: string;
    ReportType: string;
    DownloadedDate: Date;
}

export interface FunctionsProcResponse {
    FunctionID?: string;
    Function?: string;
    JobFamilyID?: string;
    JobFamilyName?: string;
    Usage: number;
}

export interface LevelsProcResponse {
    KFManagementID: number;
    KFManagementName: string;
    KFMCount: number;
    TotalKFMCount: number;
}

export interface SuccessProfilesJobDescriptionsProcResponse {
    TotalResultRecords: number;
    Jobs: JobsProcResponse[];
}

export interface JobsProcResponse {
    ClientJobID: number;
    JobName: string;
    LevelType: string;
    KFManagementName: string;
    JobFamilyName: string;
    JobSubFamilyName: string;
    BasedOnJobID: number;
    BasedOnJobName: string;
    CreatedByFirstName: string;
    CreatedByLastName: string;
    ModifiedOn: number;
    CreatedOn: number;
    RelatedJobDescriptions: number;
    TotalResultRecords: number;
    JobOrder: number;
    ModifiedBy?: string;
    ViewDate: number | string;
}

export interface UserDataResponse {
    PersonID?: number;
    PiiID?: string;
    ClientID: number;
    FirstName: string;
    LastName: string;
    JobTitle?:  string;
    EMail?: string;
    PhoneNumber?: number;
    PersonStatus?: number;
    CreatedOn?: string;
    ModifiedOn?: string;
    Department?: string;
}