import { bool } from 'aws-sdk/clients/signer';
import { QueryProps } from '../../common/common.interface';

export interface ModelQuery extends QueryProps.Default {
    preferredLocale: string;
    preferredClientId: number;
    modelVersion: number | string;
    outputType: string;
}

export interface OldModelDBResponse {
    JobCategoryID: number;
    JobCategoryName: string;
    JobCategoryDescription: string;
}

export interface OldModelAPICategories {
    id: number;
    name: string;
    description: string;
}

export interface ModelCategories {
    categories: OldModelAPICategories[];
}

export interface OldModelAPIResponse {
    models: ModelCategories;
    status: string;
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

export enum SubcategoryType {
    RESPONSIBILITY = 'RESPONSIBILITY',
    TECHNICAL_SKILLS = 'TECHNICAL_SKILLS',
}

export enum DescriptionTypes {
    RESPONSIBILITIES = 'RESPONSIBILITY',
    RESPONSIBILITY = 'RESPONSIBILITY',
    SKILLS = 'TECHNICAL_SKILLS',
    BEHAVIORAL_SKILLS = 'BEHAVIORAL_SKILLS',
    BEHAVIORS = 'BEHAVIORAL_SKILLS',
    EDUCATION = 'EDUCATION',
    TECHNICAL_SKILLS = 'TECHNICAL_SKILLS',
    EXPERIENCE = 'EXPERIENCE',
    WORK_EXPERIENCE = 'EXPERIENCE',
    WORK_CHARACTERISTICS = 'WORK_CHARACTERISTICS',
    JOB_CODE = 'JOB_CODE',
    DEPARTMENT = 'DEPARTMENT',
    JOB_FAMILY = 'JOB_FAMILY',
    JOB_SUBFAMILY = 'JOB_SUBFAMILY',
    TRAITS = 'TRAITS',
    DRIVERS = 'DRIVERS',
    CRITICAL_EXPERIENCES = 'CRITICAL_EXPERIENCES',
    REPORTS_TO = 'EDUCATION',
}

export interface NewModelDBResponse {
    CompetencyModelGUID: string;
    CompetencyModelVersion: number;
    ClientID: number;
    CompetencyModelTemplateName: string;
    CompetencyModelParentType: string;
    CompetencyModelName: string;
    CompetencyModelDescription: string;
    IsActive: number;
    IsCustomCompetencyModel: number;
    LCID: string;
    CompetencyModelCreatedOn: string;
    CompetencyModelModifiedOn: string;
    CompetencyModelCreatedBy: string;
    CompetencyModelModifiedBy: string;
    JobCategoryID: number;
    JobCategoryName: string;
    JobCategoryDescription: string;
    JobSubCategoryID: number;
    JobSubCategoryName: string;
    JobSubCategoryDescription?: string;
    JobSubCategoryOrder: number;
    IsCustomJobSubCategory: number;
    DisplayJobSubCategory: number;
    JobSubCategoryCreatedOn: string;
    JobSubCategoryModifiedOn: string;
    JobSubCategoryCreatedBy: number;
    JobSubCategoryModifiedBy: number;
    JobSubCategoryDependantID: number;
    JobSubCategoryDependantName: string;
    CoreSupportFlag: boolean | null | string;
    SkillsCount: number;
    JobCategoryOrder: number;
    IsCategoryEnabled: number;
    DENSERANK: number;
    RNK: number;
}

export interface NewModelSubCategories {
    id: number;
    name: string;
    order: number;
    isCustom: boolean;
    isActive: boolean;
    definition: string;
    skillsCount: number;
    dependents?: GetDependentsSubCategory[];
}

export interface NewModelCategories {
    id: number;
    name: string;
    description: string;
    isCategoryEnabled: number | string;
    subCategories: NewModelSubCategories[];
}

export interface NewModelAPIResponse {
    models: NewModelResponse;
    status: string;
}

export interface NewModelResponse {
    id: string;
    version: number;
    clientId: number;
    type: string;
    parentType: string;
    name: string;
    description: string;
    isActive: boolean;
    isCustom: boolean;
    locale: string;
    categories: NewModelCategories[];
}

export interface GetResponsibilityDetailIdDBResponse {
    JobSubCategoryId: number;
    JobSubCategoryName: string;
    JobSubCategoryDescription: string;
    DisplayJobSubCategory: number;
    IsCustomJobSubCategory: number;
    JobSubCategoryIsActive: number;
    JobLevelDetailID: number;
    JobLevelID: number;
    JobLevelDetailDescription: string;
    JobSubCategoryOriginalName: string;
    JobSubCategoryOriginalDescription: string;
    OriginalJobLevelDescription: string;
    IsCustomLevel: number;
}

export interface GetResponsibilityDetailIdResponse {
    subCategories: GetSubCategoryDetail[];
}

export interface GetSubCategoryDetail {
    id: number;
    name: string;
    isCustom: boolean;
    isActive: boolean;
    originalName: string;
    originalDefinition: string;
    definition: string;
    descriptions: GetDetailDescription[];
}

export interface GetDetailDescription {
    id: number;
    level: number;
    description: string;
    originalDescription: string;
    isCustom: boolean;
}

export interface GetResponsibilityModelQuery extends QueryProps.Default {
    preferredLocale: string;
    preferredClientId: number;
}

export interface UpdateResponsibilityQuery extends QueryProps.Default {
    preferredLocale: string;
    preferredClientId: number;
    modelVersion: number | string;
    modelId: string;
}

export interface UpdateResponsibilityBody {
    type: SubcategoryType;
    categories: UpdateResponsibilityCategory[];
}

export interface UpdateResponsibilityCategory {
    id: number;
    newCategoryId?: number;
    subCategories: SubCategoriesBody[];
    subFamilyId?: string;
}

export interface DescriptionsBody {
    id?: number;
    description: string;
    isCustom: boolean;
    level: number;
}

export interface SubCategoriesBody {
    id?: number;
    name: string;
    descriptions: DescriptionsBody[];
    definition: string;
    isCustom: boolean;
}

export namespace AddNewSubcategories {
    export interface Query extends QueryProps.Default {
        preferredLocale: string;
        preferredClientId: number;
        modelVersion: number | string;
        modelId: string;
    }

    export interface Body {
        categories: Category[];
        subFamilyId: string;
    }

    export interface Category {
        id: number;
        subCategories: MultiLangSubCategory[];
    }

    export interface MultiLangSubCategory {
        [locale: string]: SubCategory;
    }

    export interface SubCategory {
        name: string;
        levels: Level[];
        description: string;
    }

    export interface Level {
        description: string;
        isCustom: boolean;
        level: number;
    }
}

export interface NewJobSubCategory {
    jobCategoryID: number;
    jobSubCategoryName: string;
    userID: number;
    clientId: number;
    jobSectionCode: SubcategoryType;
    jobSubFamilyID: string | null;
    jobSubCategoryDescription: string;
    lcid: string;
}

export interface JobLevel {
    jobCategoryID: string;
    jobLevelDetailOrder: number;
    jobSubCategoryID: string;
    jobLevelDetailDescription: string;
    lcid: string;
    userId?: number;
}

export interface ItemModificationSubCategory {
    itemModificationID: string;
    jobCategoryId: string;
    jobSubCategoryId: string;
    jobSubCategoryName: string;
    jobLevelDetailDescription: string;
    jobLevelDetailId: string;
    jobLevelDetailOrder: number;
    jobSubFamilyId: string;
    jobSubCategoryDescription: string;
    isCustomLevel: number;
    lcid: string;
}

export interface ItemModificationSubCategoryDBResponse {
    ItemID: string;
}

export interface AddJobSubCategoryDBResponse {
    JobSubCategoryID: string;
    JobCategoryID: string;
}

export interface AddJobLevelDetailDBResponse {
    JobLevelDetailID: string;
}

export interface DescriptionDBResponse {
    JobSubCategoryName: string;
    JobLevel: number;
    JobLevelLabel: string;
    JobLevelDescription: string;
}
export interface ResponsibilityDescriptionQuery extends QueryProps.Default {
    subCategoryIds: string;
    type: string;
    preferredLocale: string;
    successProfileId: number;
}

export interface DescriptionsMappedResponse {
    name: string;
    level: number;
    levelLabel: string;
    description: string;
    isCustom: boolean;
}
export interface DescriptionsResponse {
    descriptions: DescriptionsMappedResponse[];
}

export interface GetSuccessProfileDescriptionsDBResponse {
    JobSubCategoryID: number;
    JobSubCategoryName: string;
    JobLevelOrder: number;
    JobSubCategoryDescription: string;
    default: number;
    JobLevelLabel: string;
    GlobalSubCategoryCode: string;
    JobSubCategoryDefinition: string;
}

export interface GetSuccessProfileDescriptionsResponse {
    subCategories: SubCategory[];
}

export interface SubCategory {
    id: number;
    definition: string;
    globalCode: string;
    descriptions: Descriptions[];
    dependents?: GetDependentSubCategory[];
}

export interface Descriptions {
    name: string;
    level: number;
    levelLabel: string;
    description: string;
    default: boolean;
}

export interface GetDependentSubCategoryDBResponse {
    JobSubCategoryID: number;
    JobSkillComponentId: number;
    JobSkillComponentCode: string;
    JobSkillComponentGUID: string | null;
    JobSkillComponentName: string;
    CoreSupportFlag: boolean | string;
}

export interface GetDependentSubCategory {
    jobSkillComponentName: string;
    isCore: boolean;
    jobSkillComponentID: number;
    jobSkillComponentCode: string;
    jobSkillComponentGUID: string | null;
}

export interface GetUserLocaleDBResponse {
    CountryCode: string;
}

export interface UserSelectedRawDBResponse {
    PersonID: number;
    ClientID: number;
    FirstName: string;
    LastName: string;
    JobTitle: string;
    CreatedOn: string;
    ModifiedOn: string;
    EMail: string;
    PhoneNumber: string;
    JobRoleTypeID: string;
    GradeID: string;
    JobGrade: string;
    UserName: string;
    companyName: string;
    JobId: string;
    JobFamilyID: string;
    JobFamilyName: string;
    JobSubFamilyID: string;
    JobSubFamilyName: string;
    JobRoleTypeName: string;
    GradeScale: string;
    SuccessProfileId: string;
    LoginAs: number;
    ExternalUUID: string;
}

export interface ClientSettingsRawDBResponse {
    ClientID: number;
    SectionProductID: number;
    JobDescriptionModelID: number;
    JobSectionID: number;
    JobSectionMandatory: number;
    JobSectionEnabled: number;
    JobSectionEditable: number;
    JobSectionOrder: number;
    CreatedBy: string;
    CreatedDate: string;
    ModifiedBy: string;
    ModifiedDate: string;
}

export interface SearchCategoryDescriptions {
    description: string;
    name: string;
    level: string;
    levelLabel: string;
}

export interface SearchCategorySubCategories {
    id: number;
    shortProfile: string;
    globalCode: string;
    definition: string;
    descriptions: SearchCategoryDescriptions[];
}

export interface SearchCategory {
    id: number;
    name: string;
    description: string;
    subCategories: SearchCategorySubCategories[];
}

export interface SearchCategoryResponse {
    id: number;
    name: string;
    description: string;
    level: string;
    subCategoryId: string;
    categories: SearchCategory[];
}

export interface SearchCategoriesRawDBResponse {
    JobSectionID: number;
    JobSectionName: string;
    JobSectionDescription: string;
    JobCategoryID: number;
    JobCategoryName: string;
    JobCategoryDescription: string;
    JobSubCategoryID: number;
    JobSubCategoryName: string;
    JobSubCategoryDefinition: string;
    JobSubCategoryDescription: string;
    JobLevelOrder: number;
    ShortProfile: string;
    JobLevelLabel: string;
    GlobalSubCategoryCode: string;
}

export interface ResponsibilitiesStatusUpdateBody {
    categories: ResponsibilitiesStatusUpdateCategory[];
    type: string;
}

export interface ResponsibilitiesStatusUpdateCategory {
    id: number;
    subCategories: ResponsibilitiesStatusUpdateSubCategory[];
}

export interface ResponsibilitiesStatusUpdateSubCategory {
    id: number;
    isActive: boolean;
}

export interface ResponsibilitiesStatusUpdateResponse {
    status: string;
    message?: string;
}

export interface QueryUpdateCountValue {
    affected?: number;
}

export interface GetDependentsSubCategory {
    id: number;
    name: string;
    isCore: boolean;
}
