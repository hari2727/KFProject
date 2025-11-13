import { QueryProps } from '../../common/common.interface';

export interface AuthTokenResponse {
    succes: boolean;
    token: string;
}

export interface CustomProfilesRawResponse {
    ClientJobID: number;
}

export interface InputJsonForKfiApi {
    engagementAttributes: EngagementAttributes;
    sections: InputSection;
}

export interface InputSection {
    jobAnalysis: JobAnalysis;
    companyCulture: JobAnalysis;
}

export interface JobAnalysis {
    startDate: number;
    completedDate: number;
    answers: JobAnswers[];
}

export interface JobAnswers {
    answersequence: number;
    block: string;
    question: string;
    time: number;
    answer: number;
    blocksequence?: number;
}

export interface EngagementAttributes {
    managementLevel: string;
    progression?: string;
    scope?: string;
    demoVersion: string;
    normCountry: string;
    normVersion: number;
}

export interface ClientJobDecisionMakingSliderResponse {
    content: ClientJobDecisionMakingContent;
    normInfo: NormInfo;
    normName: NormName;
}

export interface ClientJobDecisionMakingContent {
    roleRequirementQA: RoleRequirementQA[];
}

export interface NormName {
    normRegion: number;
    normVersion: number;
    managementLevel: number;
    demoVersion: number;
}

export interface NormInfo {
    level_norm: string;
    region_norm: string;
    industry_norm: string;
    function_norm: string;
    source: string;
    demo_version: string;
    norm_version: string;
}

export interface RoleRequirementQA {
    ucpCode: string;
    sliderValue: number;
}

export interface TraitsAndDriversResponse {
    sections: TraitsAndDriversSections[];
}

export interface TraitsAndDriversSections {
    id: number;
    name: string;
    description: string;
    code: string;
    categories: TraitsAndDriversCategoriees[];
}

export interface TraitsAndDriversCategoriees {
    id: string;
    name: string;
    description: string;
    subCategories: TraitsAndDriversSubCategories[];
}

export interface TraitsAndDriversSubCategories {
    id: string;
    definition: string;
    type: string;
    globalCode: string;
    descriptions: TraitsAndDriversDescriptions[];
}

export interface TraitsAndDriversDescriptions {
    name: string;
    level: string;
    score: string;
    description: string;
}

export interface KfiApiResponseRaw {
    ClientJobID: number;
    ManagementLevel: string;
    Progression?: string;
    Scope?: string;
    DemoVersion: string;
    NormCountry: string;
    NormVersion: number;
    SliderStartDate: number;
    SliderAnswerSequence: number;
    SliderBlock: string;
    SliderQuestion: string;
    SliderTime: number;
    SliderAnswer: number;
    Blocksequence: number;
    SliderCompletedDate: number;
    CulturalStartDate: number;
    CulturalAnswerSequence: number;
    CulturalBlock: string;
    CulturalQuestion: string;
    CulturalTime: number;
    CulturalAnswer: number;
    CulturalCompletedDate: number;
}

export interface AssessmentRawResponse {
    ClientJobID: number;
    kfLevelGlobalCode: string;
    KFRoleLevelID: number;
    NormCountry: string;
    NormVersion: number;
    UCPCode: string;
    SliderValue: number;
    CultureCode: string;
    CulturalValue: number;
}

export interface JsonForCalculateAssessment {
    driversCultureRankings: DriversCultureRankings[];
    roleRequirementQA: RoleRequirementQA[];
    kfLevelGlobalCode: string;
    normCountry: string;
    normVersion: number;
    kfRoleLevelId: number;
    jobId: number;
    clientId: string;
}

export interface DriversCultureRankings {
    cultureCode: string;
    value: number;
}

export interface SliderQuery extends QueryProps.Default {
    clientId: string;
}
