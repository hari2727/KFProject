// Create Components

export interface CreateComponentsPayload {
    skillId: number;
    components: CreateComponentOptions[];
}

export interface CreateComponentOptions {
    name?: string;
    isCore?: number;
    isActive?: number;
    modelGUID?: string;
    modelVersion?: string;
}

export interface CreateComponentsResponse {
    skillId: number;
    components: StagedComponent[];
}

export interface StagedComponent {
    id: number;
    name: string;
    code?: string;
    guid?: string;
    IsDeleted?: number;
    IsActive?: number;
    isCore?: number;
    isCustom: number;
    locale?: string;
}


// Component details

export interface ComponentBaseDetails {
    id: number;
    name: string;
    isCustom: number;
}

export interface ComponentDetailsResponse extends ComponentBaseDetails {
    skills: ComponentDetailsContextSkillDetails[];
    usageCount: ComponentDetailsUsageCount[];
}

export interface ComponentDetailsContextSkillDetails {
    id: number;
    name: string;
    categoryName: string;
    isActive: number;
    isCore: number;
    isCustom: number;
    successProfilesNumber: number;
}

export interface ComponentDetailsUsageCount {
    profileId: number;
    profileType: string;
    createdBy: string;
    count: number;
}

export interface ComponentDetailsDBResponse {
    details: ComponentBaseDetails;
    skills: ComponentDetailsContextSkillDetails[];
    usageCount: ComponentDetailsUsageCount[];
}

// Skill details

export interface SkillBaseDetails {
    id: number;
    name: string;
    originalName: string;
    description: string;
    originalDescription: string;
    jobCategoryId?: number;
    jobFamilyId?: string;
    jobSubFamilyId?: string;
    isActive: number;
    isCustom: number;
}

export interface SkillDetailsResponse extends SkillBaseDetails {
    components: SkillDetailsContextComponentDetails[];
    levels: SkillDetailsLevel[];
    usageCount: SkillDetailsUsageCount[];
    revertCount: number;
}

export interface SkillOriginalComponentsResponse {
    components: SkillDetailsContextComponentDetails[];
}

export interface SkillDetailsDBResponse {
    details: SkillBaseDetails;
    components: SkillDetailsContextComponentDetails[];
    levels: SkillDetailsLevel[];
    usageCount: SkillDetailsUsageCount[];
    revertCount: SkillDetailsComponentRevertCount[];
}

export interface SkillDetailsLevel {
    id: number;
    description: string;
    originalDescription: string;
    level: number;
    isCustom: number;
}

export interface SkillDetailsContextComponentDetails {
    id: number;
    name: string;
    code: string;
    guid: string;
    isActive: number;
    isCore: number;
    isCustom: number;
    successProfilesNumber: number;
    mappingId: number;
}

export interface SkillDetailsComponentRevertCount {
    revertCount: number;
}

export interface SkillDetailsUsageCount {
    profileId: number;
    profileType: string;
    createdBy: string;
    count: number;
}


// Skills to Components links

export interface SkillComponentsLinksPayload {
    skills: {
        [ skillId: string ]: {
            [ componentsId: string ]: SkillComponentsLinkComponentOptions;
        };
    };
}

export interface SkillComponentsLinkComponentOptions {
    id?: number;
    name?: string;
    code?: string;
    guid?: string;
    isActive?: number;
    isDeleted?: number;
    isCore?: number;
    actionType?: number;
}

export interface ComponentsSkillsDBMappings {
    components: ComponentBaseDBDetails[];
    mappings: ComponentSkillDBMapping[];
}

export interface ComponentBaseDBDetails {
    id: number;
    name: string;
    code: string;
    guid: string;
    isCustom?: number;
    successProfilesNumber: number;
    isActive: number;
}

export interface ComponentSkillDBMapping {
    componentId: number;
    skillId: number;
}
