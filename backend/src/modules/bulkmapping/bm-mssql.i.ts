import { MssqlDataSets } from './bm.enum';

export interface SpsDataRaw {
    ClientJobId: string;
    JobTitle: string;
    Grade: string;
    MinGrade: string;
    MaxGrade: string;
    IsExecutive: string;
    JobFamilyID: string;
    FunctionName: string;
    JobSubFamilyID: string;
    SubFunctionName: string;
    KFManagementID: string;
    KFManagementName: string;
    CustomGrade: string;
    Midpoint: string;
    GradesetID: string;
    GradeSetName: string;
    TotalProfiles: string;
}

export interface SpsIdsRaw {
    ClientJobId: string;
}

export interface SpsDataStream {
    [MssqlDataSets.SPS_DATA_RAW]: SpsDataRaw[];
    [MssqlDataSets.SPS_IDS_RAW]: SpsIdsRaw[];
}

export interface SpsMetaDataRaw {
    MethodValueID: string;
    MethodID: string;
    MethodValueLabel: string;
    LevelID: string;
    LevelName: string;
    SearchType: string;
    JobSubFamilyID: string;
    JobSubFamilyName: string;
    LevelOrder: string;
    Description: string;
    GradeSetID: string;
    GradeSetName: string;
}

export interface CompetencyModelRaw {
    ClientID: string;
    CompetencyModelID: string;
    CompetencyModelGUID: string;
    CompetencyModelVersion: string;
    CompetencyModelStatus: string;
    CompetencyModelName: string;
    CompetencyModelDescription: string;
    LCID: string;
    LocaleName: string;
}

export interface CompetencyRaw {
    ClientID: string;
    FactorId: string;
    FactorIsActive: string;
    FactorIsCustom: string;
    FactorName: string;
    FactorDescription: string;
    ClusterId: string;
    ClusterIsActive: string;
    ClusterIsCustom: string;
    ClusterName: string;
    ClusterDescription: string;
    CompetencyId: string;
    CompetencyIsActive: string;
    CompetencyIsCustom: string;
    CompetencyName: string;
    CompetencyDescription: string;
    JobSubCategoryId: string;
}

export interface CompetencyLevelRaw {
    JobSubCategoryID: string;
    JobSubCategoryName: string;
    JobLevelOrder: string;
    JobLevelDetailDescription: string;
    JobLevelLabel: string;
    GlobalSubCategoryCode: string;
    JobSubCategoryDescription: string;
}

export interface selectBulkMapItemId {
    ItemModificationID: number;
}

export interface insertBulkMapProfile {
    itemModificationId: number;
    clientJobId: number;
}

export interface insertBulkMapSubCategory {
    competencyId: number;
    levelId: number;
    order: number;
    itemModificationId?: number;
}

export interface BulkPublishStatusDBResponse {
    FamilyModelStatus: number;
    SkillModelStatus: number;
    RespModelStatus: number;
    CompetencyModelStatus: number;
}
