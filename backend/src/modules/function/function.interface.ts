import { Param } from '@nestjs/common';
import { QueryProps } from '../../common/common.interface';

export interface FunctionProps extends QueryProps.Default {
    clientId: string;
}

export interface UpdateFamilyStatusQuery extends QueryProps.Default {
    modelId: string;
    preferredLocale: string;
    preferredClientId: string;
    modelVersion: string;
}

export interface UpdateFamilyStatusResponse {
    status: string;
}

export interface ProfileStatsQuery extends QueryProps.Default {
    preferredClientId: string;
    jobFamilyId: string;
    jobSubFamilyId?: string | null;
}

export interface ProfileStats {
    ProfileType: string;
    CreatedBy: string;
    ProfileCreatedByCnt: number;
}

export interface ProfileStatsResponse {
    profileType: string;
    createdBy: string | null;
    count: number;
}

export enum FamilyStatus {
    MODIFIED = 'MODIFIED',
    PUBLISHED = 'PUBLISHED',
}

export interface FamilyStatusBody {
    [key: string]: FamilySubFamily[];
}

export const FAMILY_TYPE = Object.freeze({
    families: 'FAMILY',
    subFamilies: 'SUB_FAMILY',
});

export interface FamilySubFamily {
    id: string;
    isActive: boolean;
    name: string;
}
export interface JobFamily {
    families: {
        name: string;
        kfJobFamilyId: string;
        description: string;
        createdBy: number;
    };
}
export interface AddJobFamilyResponse {
    JobFamilyID: string;
    JobFamilyName: string;
    JobFamilyDescription: string;
    IsCustom: number;
    DisplayFlagID: number;
    ParentFamilyID: string;
}

export interface GetJobFamilyResponse {
    JobFamilyID: string;
    JobFamilyName: string;
    JobFamilyDescription: string;
    JobSubFamilyID: string;
    JobSubFamilyName: string;
    JobSubFamilyDescription: string;
    JobRoleTypeID: string;
    JobRoleTypeName?: string;
    JobRoleTypeDescription?: string;
    MinimumPoints?: any;
    MaximumPoints?: any;
}

export interface GetJobFamilyQuery extends UpdateFamilyStatusQuery {
    type: string;
}

export interface FamiliesOnTypeResponseData extends JobTypeDetails {
    subFamilies?: SubFamilies[];
}

export interface SubFamilies extends JobTypeDetails {
    jobTypes?: JobTypeDetails[];
}

export interface JobTypeDetails {
    id: string;
    name: string;
    description: string;
}

export interface JobFamilyResponse {
    family: FamilyObject;
}

export interface FamilyObject extends JobTypeDetails {
    isCustom: boolean;
    isActive: boolean;
    kfJobFamilyId: string;
}

export interface FunctionsSubfunctionsPayloadObj {
    families: FunctionsSubfunctionsPayload[];
}
export interface FunctionsSubfunctionsPayload {
    id: string;
    isCustom: boolean;
    subFamilies?: FunctionSubFamilies[];
    name: string;
    description: string;
    isActive?: boolean;
    jobsCount?: number;
    originalName?: string;
    kfJobFamilyId?: string;
    originalDescription?: string;
}
export interface FunctionSubFamilies {
    id: string;
    isCustom: boolean;
    name: string | null;
    description: string;
    isActive: boolean;
    jobsCount: number;
    originalName: string;
    jobCategoryId: string;
    kfJobSubFamilyId: string;
    originalDescription?: string;
}
export interface familyList {
    JobFamilyID: string;
    isCustom: number;
    JobFamilyName: string;
    LCID: string;
}
export interface SubFamilyList {
    JobFamilyID: string;
    JobSubFamilyID: string;
    isCustom: number;
    JobSubFamilyName: string;
    LCID: string;
}

export interface FamilySubFamilyModel {
    FamilySubFamilyModelID: string;
    ClientID: string;
    LCID: string;
    FamilySubFamilyModelVersion: string;
    FamilySubFamilyModelGUID: string;
    FamilySubFamilyModelName: string;
    FamilySubFamilyModelDescription: string;
    FamilySubFamilyModelOrder: string;
    IsActive: string;
    FamilySubFamilyModelCreatedBy: string;
    FamilySubFamilyModelModifiedBy: string;
    FamilySubFamilyModelCreatedOn: string;
    FamilySubFamilyModelModifiedOn: string;
    JobFamilyID: string;
    JobFamilyDescription: string;
    JobFamilyName: string;
    JobFamilyDisplayFlagID: string;
    JobFamilyIsActive: number;
    JobFamilyOrder: string;
    CustomJobFamily: number;
    JobFamilyCreatedBy: string;
    JobFamilyModifiedBy: string;
    JobFamilyCreatedOn: string;
    JobFamilyModifiedOn: string;
    JobSubFamilyID: string;
    JobSubFamilyName: string;
    JobSubFamilyDescription: string;
    CustomJobSubFamily: number;
    JobSubFamilyDisplayFlagID: string;
    JobSubFamilyIsActive: number;
    JobSubfamilyOrder: string;
    JobSubFamilyCreatedBy: string;
    JobSubFamilyModifiedBy: string;
    JobSubFamilyCreatedOn: string;
    JobSubFamilyModifiedOn: string;
    JobFamilyCount: number;
    JobSubFamilyCount: number;
    ParentFamilyID: string;
    ParentSubFamilyID: string;
    JobFamilyOriginalName: string;
    JobFamilyOriginalDescription: string;
    JobSubFamilyOriginalName: string;
    JobSubFamilyOriginalDescription: string;
    ClientIndustryID: string;
    ClientIndustryTitle: string;
    JobCategoryID: string;
    JobFamilyOriginalNameEng: string;
    JobFamilyOriginalDescriptionEng: string;
    JobSubFamilyOriginalNameEng: string;
    JobSubFamilyOriginalDescriptionEng: string;
    IsPrimaryLanguage?: string;
    UniqueSubFamilyID?: string;
}

export interface JobModelDbResponse {
    modelId: string;
    modelVersion: string;
    modelName: string;
    modelDescription: string;
    isActive: Number;
    isCustom: Number;
    outputType: string;
    locale: string;
    localName: string;
    isMaster: Number;
}

export interface JobModelQueryProps extends QueryProps.Default {
    preferredLocale: string;
    preferredClientId: string;
}

export interface JobModelDetailsQueryprops extends JobModelQueryProps {
    modelId: string;
    modelVersion: string;
    type: string;
}

export interface JobModelResponse {
    models: JobModelProps[];
}
export interface JobModelProps {
    id: string;
    version: string;
    clientId: string;
    type: null | string;
    parentType: null | string;
    name: string;
    description: string;
    isActive: boolean;
    isCustom: boolean;
    outputType: string;
    locales: JobModelLocale[];
}

export interface JobModelLocale {
    locale: string;
    localeName: null | string;
    isMaster: boolean;
}

export interface JobModelDetailsQueryProps extends QueryProps.Default {
    preferredLocale: string;
    modelVersion: string;
    type?: string;
}
export interface JobModelDetailsData {
    id: string;
    isCustom: boolean;
    subFamilies?: FunctionSubFamilies[];
    name: string;
    description: string;
    isActive: boolean;
    jobsCount: number;
    originalName: string;
    kfJobFamilyId: string;
    originalDescription: string;
    isParent?: boolean;
}

export interface JobModelDetailsResponse {
    status: string;
    jobFamilies: JobModelDetailsData[];
}

export interface JobIndustryResponse {
    status: string;
    industry: JobModelIndustry[];
}
export interface JobModelIndustry {
    id: string;
    name: string;
    jobFamilies: JobModelDetailsData[];
}

export interface JobClientIndustryDbValues extends FamilySubFamilyModel {
    ClientIndustryID: string;
    ClientIndustryTitle: string;
}

export interface ProfileStasApiResponse {
    profileStats: ProfileStatsResponse[];
}

export interface FamilesValidation {
    JobFamilyID: string;
    JobFamilyName: string;
}
export interface SubFamilesValidation {
    JobFamilyID: string;
    JobSubFamilyID: string;
    JobSubFamilyName: string;
}
export interface ParamsObj {
    modelId: string | number;
    [key: string]: string | number | null;
}

export interface JobFamilySubFamilyParams {
    ItemType: string | null;
    FamilySubFamilyModelGUID: string;
    JobFamilyID: string;
    JobFamilyName: string;
    JobFamilyIsCustom: number;
    JobSubFamilyID: string | null;
    JobSubFamilyName: string | null;
    JobSubFamilyDescription: string | null;
    JobSubFamilyIsCustom: number;
    JobSubFamilyDisplayFlagID: string | null;
    KFFamilyID: string | null;
    ParentSubFamilyID: string | null;
    JobSubFamilyOrder: number;
    CreatedBy: number;
    ModificationComplete: number;
    LCID: string;
    JobFamilyDescription: string;
}

export interface FamilySubFamilyParams extends JobFamilySubFamilyParams {
    IsPrimaryLanguage: string;
    UniqueSubFamilyID: string;
}

export interface LanguageFunctions {
    families: LanguageFunction[];
}

export interface LanguageFunction {
    id?: string;
    locale: string;
    name: string;
    kfJobFamilyId: string;
    description: string;
    isParent: boolean;
    isCustom: boolean;
    subFamilies: LanguageSubFunction[];
}

export interface LanguageSubFunction {
    id?: string;
    name: string;
    kfJobSubFamilyId: string;
    description: string;
    uniqueId: string;
    isCustom: boolean;
}
