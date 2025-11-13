import { OperationId } from "../../bulk-update/bulk-update.types";
import { KfPermissions, SearchPagingResponse } from "../../common/common.interface";
import { ProfileGradeInfo } from "../../common/grade.i";
import { MssqlDataSets } from "../bulkmapping/bm.enum";

export type BMPCSuccessProfileIdsPayload = {
    successProfileIds: string[];
};

export type BMPCGetFiltersQuery = {
    isView?: number;
    wcToggle: string;
};

export interface BMPCGetFiltersMetadataOptions {
    clientId: number;
    userId: number;
    locale: string;
    wcToggle: number;
    operationId: OperationId;
    permissions: KfPermissions;
    isView: number;
}

export interface BMPCSearchProfilesPayload {
    locale?: string;
    operationId: OperationId;
    searchString: string;
    searchColumn: string;
    filterBy: string;
    filterValues: string;
    sortColumn: string;
    sortBy: string;
    wcToggle: number;
    pageIndex: number;
    pageSize: number;
    isView?: number;
}

export interface BMPCSearchProfilesRequestDBOptions {
    clientId: number;
    userId: number;
    locale: string;
    operationId: OperationId;
    searchString: string;
    searchColumn: string;
    filterBy: string;
    filterValues: string;
    sortColumn: string;
    sortBy: string;
    wcToggle: number;
    permissions: KfPermissions;
    pageIndex: number;
    pageSize: number;
    isView: number;
}

export interface BMPCGetBulkPCProfileDetailsDTO {
    JobID: number;
    JobTitle: string;
    JobCode: string;
    JobPropertyName: string | null;
    BenchmarkIndicator: number | null;
    CountOfProfiles: number;
    CustomGrade: string | null;
    DENSERANK: number;
    FunctionName: string;
    Grade: number;
    GradeSetID: number;
    GradeSetName: string;
    IsExecutive: number;
    KFHayPoints: number;
    Locale: string;
    MaxGrade: number | null;
    MidPoint: number | null;
    MinGrade: number | null;
    ModifiedOn: number;
    ProfileCollectionsName: string | null;
    ProfileCollectionsId: string | null;
    SubFunctionName: string;
    TotalPoints: number;
    WCPoints: number;
    WCScore: string | null;
}

export interface BMPCProfileCollection {
    profileCollectionsId: number;
    profileCollectionsName: string;
}

export interface BMPCProfileDetails {
    id: number;
    title: string;
    familyName: string;
    subFamilyName: string;
    profileCollections: BMPCProfileCollection[];
    benchmarkIndicator: number | null;
    totalPoints: number | null;
    wcTotalPoints: number | null;
    grade: ProfileGradeInfo,
    countOfProfiles: number;
    modifiedOn: number;
}

export interface BMPCSearchProfileResponse extends SearchPagingResponse {
    successProfiles: BMPCProfileDetails[];
    allFilteredIds: number[];
}

export type BMPCChangesPayload = {
    operationId: OperationId;
    changes: BMPCChange[];
}
export type ProfileCollectionId = number;

export type BMPCChange = {
    profileCollectionIds: ProfileCollectionId[];
    successProfileIds: number[];
}

export interface BMPCRemoveChangesDTO {
    operationId: number;
    successProfileIds: number[];
}

export interface BMPCAddChangeDTO {
    operationId: number;
    successProfileId: number;
    profileCollectionIds: string;
}

export interface BMPCProfilesSearchDataStream {
    [MssqlDataSets.DATA_RAW]: BMPCGetBulkPCProfileDetailsDTO[];
}

export type BMPCApplyChangesOperationIdResponse = {
    mapOperationId: OperationId;
};

export interface BMPCCopyChangesDTO {
    viewOperationId: number;
    mapOperationId: number;
}

export interface BMPCSearchProfilesOptions {
    authtoken: string;
    clientId: number | string;
    userId: number | string;
    locale?: string;
    operationId: OperationId | string;
    searchString: string;
    searchColumn: string;
    filterBy: string;
    filterValues: string;
    sortColumn: string;
    sortBy: string;
    wcToggle: number | string;
    pageIndex: number | string;
    pageSize: number | string;
    isView?: number | string;
}

export interface BMPCGetFiltersOptions {
    authtoken: string;
    clientId: number | string;
    userId: number | string;
    locale?: string;
    operationId: OperationId | string;
    wcToggle: number | string;
    isView?: number | string;
}

export interface BMPCAddChangesOptions {
    clientId: number | string;
    operationId: OperationId | string;
    changes: BMPCChange[];
    skipVerifyProfileCollections?: boolean;
    skipRemovePreviousChanges?: boolean;
}

export interface BMPCApplyChangesOptions {
    clientId: number | string;
    userId: number | string;
    operationId: OperationId | string;
}
