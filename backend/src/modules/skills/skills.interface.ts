import { QueryProps } from '../../common/common.interface';
import { GetDependentsSubCategory, GetDetailDescription, SubcategoryType } from '../responsibilities/responsibilities.interface';

export interface SkillsQueryBase extends QueryProps.Default {
    preferredClientId?: string;
}

export interface JobCategoryQuery extends SkillsQueryBase {
    jobCategoryId: string;
}

export interface JobCategoryLanguage {
    locale: string;
    jobFamilyName: string;
    jobSubFamilyName: string;
}

export interface JobCategoryLanguagesResponse {
    [key: string]: JobCategoryLanguage[];
}

export interface JobCategoryLegacyLanguage {
    locale: string;
    jobCategoryName: string;
}

export interface JobCategoryTranslation {
    locale: string;
    jobCategoryName: string;
}

export interface JobCategoryLegacyLanguagesResponse {
    [jobCategoryId: string]: JobCategoryTranslation[];
}

export interface GetSkillDetail {
    id: number;
    name: string;
    isCustom: boolean;
    isActive: boolean;
    originalName: string;
    originalDefinition: string;
    definition: string;
    skillsCount?: number;
    coreSkillsCount?: number;
    nonCoreSkillsCount?: number;
    descriptions: GetDetailDescription[];
    dependents?: GetDependentsSubCategory[];
}

export interface GetSkillDetailResponse {
    subCategories: GetSkillDetail[];
}

export interface SkillDetail {
    id: number;
    name: string;
    isCore: boolean;
    displayOrder: number;
}

export interface GetResponsibilityModelQuery extends QueryProps.Default {
    preferredLocale: string;
    preferredClientId: number;
    outputType: string;
    modelVersion: string;
    subCategoryIds: string;
}


export class PagingDto {
    pageIndex: number;
    pageSize: number;
    totalPages: number;
    totalResultRecords: number;
}

export class SkillsApiResponseDto {
    skills: TechnicalSkillDto[];
    paging: PagingDto;
}
export interface SkillItem {
    id: number;
    name: string;
    status: string;
}

export enum SortOrder {
    ASC = "ASC",
    DESC = "DESC",
  }


export interface SkillsSearchFilterQuery extends QueryProps.Default {
    preferredLocale?: string;
    searchString?: string;
    sortColumn?: string;
    sortBy?: SortOrder;
    filterValues?: string;
    pageIndex?: string;
    pageSize?: string;
    searchColumn?: string;
}
export interface SkillsStatusUpdateResponse {
    status: string;
    message: string;
}

export interface UpdateSkillsStatusQuery extends QueryProps.Default {
    status: string;
}

export interface UpdateStatusOfModelItemForSkillsBody {
    categories: any[];
    type: string;
}

export interface UpdateSkillsBySkillIdBody {
    categories: any[];
    type: SubcategoryType;
}

export interface NewSearchDependantDBResponse {
    JobSubCategoryDependantID: number;
    CoreSupportFlag: boolean | 'true' | 'false';
    TotalSkills: number;
    CoreCount: number;
    NonCoreCount: number;
}

export enum SkillType {
    TECHNICAL_SKILLS = 'TECHNICAL_SKILLS'
}

export interface ModelDataResponse {
    models: ModelData[];
}

export interface ModelData {
    id: string;
    version: string;
    clientId: number;
    type: string;
    parentType: string;
    name: string;
    description: string;
    isActive: boolean;
    isCustom: boolean;
    outputType: string;
    locales: ModelLocale[];
}

export interface ModelLocale {
    locale: string;
    localeName: string;
    isMaster: boolean;
}

export interface ModelDBResponse {
    CompetencyModelGUID: string;
    CompetencyModelVersion: string;
    CompetencyModelName: string;
    CompetencyModelDescription: string;
    ClientID: number;
    LCID: string;
    LocaleName: string;
    MasterCompetencyModel: number;
    CompetencyModelTemplateName: string;
    CompetencyModelParentType: string;
    IsActive: number;
    IsCustomCompetencyModel: number;
}

export interface OldModelAPIResponse {
    models: {
        categories: OldModelAPICategories[];
    };
    status: string;
}

export interface OldModelAPICategories {
    id: number;
    name: string;
    description: string;
}

export interface OldModelAPIItems {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    isCustom: boolean;
    order: number;
}

export interface GetOldModelsByModelIdQuery extends QueryProps.Default {
    modelId: string;
}

export interface GetModelsForSkillsQuery extends QueryProps.Default {
    preferredClientId: number;
    preferredLocale: string;
    modelVersion: string;
    outputType: string;
}

export interface NewSearchDependantDBResponse {
    JobSubCategoryID: number;
    JobSubCategoryDependantID: number;
    JobSubCategoryDependantName: string;
    CoreSupportFlag: boolean | 'true' | 'false';
    TotalSkills: number;
    CoreCount: number;
    NonCoreCount: number;
    RNK: number;
}

export interface GetResponsibilityDetailIdDBResponse {
    JobSubCategoryId: number;
    JobSubCategoryName: string;
    JobSubCategoryDescription: string;
    JobLevelID: number;
}

export interface ModelQuery {
    preferredLocale: string;
    preferredClientId: number;
    modelVersion: string;
    outputType: string;
}

export interface UpdateResponsibilityQuery extends ModelQuery {
    modelId: string;
}

export interface ResponsibilitiesStatusUpdateResponse {
    status: string;
    message: string;
}

export interface OldModelAPICategories {
    id: number;
    name: string;
    description: string;
}


export const DEFAULT_FILTER_PARAMS: Required<Pick<SkillsSearchFilterQuery, "pageIndex" | "pageSize" | "sortBy" | "sortColumn">> = {
    pageIndex: "1",
    pageSize: "20",
    sortBy: SortOrder.ASC,
    sortColumn: 'TECHNICAL_SKILLS'
  };


  export type TechnicalSkillRawResult = {
    JobSubCategoryID: number;
    JobSubCategoryCde: string;
    JobSubcategoryName: string;
    JobSubCategoryDependantID: number;
    JobSubCategoryDependantName: string;
    CoreSupportFlag: string;
    TotalRecords: string;
};


export class CompetencyDto {
    id: number;
    name: string;
}

export class TechnicalSkillDto {
    id: number;
    name: string;
    isCore: boolean;
    competencies: CompetencyDto[];
}