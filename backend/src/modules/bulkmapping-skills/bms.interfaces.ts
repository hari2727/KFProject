import { QueryProps } from '../../common/common.interface';

export interface BulkMappingSkillsQuery extends QueryProps.Default {
    preferredClientId?: string;
    preferredLocale?: string;
}

export interface BulkMappingSkillsStagingPayload {
    skills: BulkMappingSkillsStagingSkill[];
    successProfileIds: string[];
}

export interface BulkMappingSkillsStagingSkill {
    skillId: number;
    levelId: number;
    order: number;
    dependents?: BulkMappingSkillsStagingSkillComponent[];
}

export interface BulkMappingSkillsStagingResponse {
    itemModificationId: number;
}

export interface BulkMappingSkillsStagingItemModificationID {
    ItemModificationID: number;
}

export interface BulkMappingSkillsStagingDTO {
    profiles: BulkMappingSkillsStagingProfileDTO[];
    skillLevels: BulkMappingSkillsStagingSkillLevelDTO[];
    skillComponents: BulkMappingSkillsStagingSkillComponentDTO[];
}
export interface BulkMappingSkillsStagingProfileDTO {
    ItemModificationID: number;
    ClientJobID: number;
}

export interface BulkMappingSkillsStagingSkillLevelDTO {
    ItemModificationID: number;
    JobSubCategoryId: number; // skillId
    JobLevelDetailOrder: number | null; // levelId
    SectionDetailOrder: number; // order
}

export interface BulkMappingSkillsStagingSkillComponentDTO {
    ItemModificationID: number;
    JobSubCategoryId: number; // skillId
    JobSkillComponentName: string; // dependents[]
    JobSubCategoryDependantOrder: number; // dependents[] index
    JobSkillComponentCode: string;
    JobSkillComponentGUID: string | null;


}

export interface BulkMappingSkillsStagingSkillComponent {
    jobSkillComponentId: number;
    jobSkillComponentName: string;  //JobSubCategoryDependantName
    jobSkillComponentCode: string;
    jobSkillComponentGUID: string | null;
}
