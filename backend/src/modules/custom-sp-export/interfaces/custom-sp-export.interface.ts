import { IsArray, IsEnum } from 'class-validator';
import { QueryProps } from '../../../common/common.interface';
import {
    BehavioralCompetencyRaw,
    DriverRaw,
    EducationRaw,
    GeneralExperienceRaw,
    ManagerialExperienceRaw,
    ResponsibilityRaw,
    SkillRaw,
    SpRaw,
    TaskRaw,
    ToolRaw,
    TraitRaw,
} from './custom-sp-export.db.interface';
import { Transform } from 'class-transformer';
import { toLocale, toNumber } from '../../../_shared/convert';
import { AppResponse } from '../../../_shared/response/app-response';


export class HCMExportRequestQuery {
    clientId: number;
    lcid: string;
}

export interface HCMExportRequestBody {
    downloadType?: string;
    successprofileIds?: number[];
    jobCodes?: string[];
    downloadFormat: FileFormats;
}

export class HcmSpExportQuery extends QueryProps.Default {
    @Transform(({ value }) => toNumber(value))
    clientId: number;

    @Transform(({ value }) => toLocale(value))
    lcid: string;
}

export enum FileFormats {
    EXCEL = 'excel',
    CSV = 'csv',
    JSON = 'json',
    HCM = 'hcm',
}

export class HcmSpExportReqBody {
    downloadType?: string;

    @IsArray()
    successprofileIds: number[];

    @IsEnum(FileFormats)
    downloadFormat: FileFormats;
}

export interface HCMIntDownloadProfilesRequest {
    GenerateHCMIntDownloadID: number;
    ClientJobID: number;
}

export interface Job extends JobBase {
    jobProperties: JobProperty[];
}

export interface JobBase {
    jobID: string;
    jobTitle: string;
    jobStatus: JobStatus;
    jobCode: string;
    hideInPM: string;
    totalPoints: string;
    hiddenInProfileManager: string;
    function: string;
    subFunction: string;
    valueStreamName: string;
    roleTypeName: string;
    khPracticalTechnicalKnowledge: string;
    khManagerialKnowledge: string;
    khCommunicationInfluencingSkill: string;
    khPoints: string;
    khRationales: string;
    psFreedomThink: string;
    psThinkingChallenge: string;
    psPercentage: string;
    psPoints: string;
    psRationales: string;
    acFreedomAct: string;
    acAreaImpact: string;
    acNatureImpact: string;
    acPoints: string;
    acRationales: string;
    wcPhysicalEffort: string;
    wcPhysicalEnvironment: string;
    wcSensoryAttention: string;
    wcMentalStress: string;
    wcPoints: string;
    wcRationale: string;
    kfHayPoints: string;
    gradeSetId: string;
    gradeSet: string;
    grade: string;
    shortProfile: string;
    benchmarkIndicator?: string;
    isGradeOverriddenByJE?: string;
    createdDate: string;
    createdBy: string;
    lastUpdateDate: string;
    lastUpdatedBy: string;
}

export interface JobForKFATemplate {
    id: number;
    title: string;
    jobCode: string;
    hideInPM: number;
    familyName: string;
    subFamilyName: string;
    valueStreamName: string;
    roleTypeName: string;
    wcTotalPoints: number;
    totalPoints: number;
    grade: KfaGrade;
    isGradeOverriddenByJE: boolean;
    benchmarkIndicator: number;
    source: KfaSource[];
    jeScores: KfaJEScore[];
    shortProfile: {
        value: string;
    };
    status: JobStatus;
    matrixLevelsLabels?: KfaMatrixLabel;
    overallRationale: string;
    JobID: number;
    JobProperties: JobProperty[];
}

export interface KfaGrade {
    standardHayGrade: string;
    customGrades: {
        gradeSetId: number;
        gradeSetName: string;
        grades: { gradeLabel: 'string' }[];
    };
}

export interface KfaSource {
    type: string;
    firstName: string;
    lastName: string;
    effectiveDateTime: string;
}

export interface KfaJEScore {
    id: number;
    jeScoreType: string;
    rationaleDescription: string;
    points?: string;
    options: {
        id: number;
        code: string;
        type: string;
    }[];
}

export enum JobStatus {
    DRAFT = 'Draft',
    ACTIVE = 'Active',
    DRAFT_KF = 'KF Draft',
    INACTIVE = 'Inactive',
}

export interface KfaMatrixLabel {
    managementId: number;
    managementName: string;
    levelId: number;
    levelName: string;
    levelOrder: string;
}

export interface JobProperty {
    id: string;
    code: string;
    name: string;
    isMultiSelected: boolean;
    isRequired: boolean;
    props: UsedJobPropertyValue[];
}
export interface UsedJobPropertyValue {
    id: string;
    name: string;
}

export interface KfaJobsForExcel {
    columnNames: { [key: string]: string | Object };
    data: Job[];
}

export enum HCMProfileEnum {
    DESCRIPTION = 'Description',
    RESPONSIBILITY_DESCRIPTION = 'Responsibility Description',
    BEHAVIORAL_COMPETENCY_DESCRIPTION = 'Behavioral Competency Description',
    TECHNICAL_COMPETENCY_DESCRIPTION = 'Technical Competency Description', // This is added for backward compability
    SKILL_DESCRIPTION = 'Skill Description', // This is a new name for Skill Description column
    EDUCATION_DESCRIPTION = 'Education Description',
    SKILL_COMPONENTS = 'Skill Components',
    JOB_CODE = 'Job Code',
    SUCCESS_PROFILE_DESCRIPTION = 'Success Profile/Job Description',
    JOB_NAME = 'JobName',
    BEHAVIORAL_NAME = 'Behavioral Name',
    DRIVER_NAME = 'Driver Name',
    TRAIT_NAME = 'Trait Name',
    ENABLED = 'Enabled',
    EDUCATION = 'Education',
    GENERAL_EXPERIENCE = 'General Experience',
    MANAGERIAL_EXPERIENCE = 'Managerial Experience',
    RESPONSIBILITY_NAME = 'Responsibility Name',
    SKILL_NAME = 'Skill Name',
    JOB_ID = 'JobID',
    JRT_DETAIL_ID = 'JRTDetailID',
    JOB_FAMILY_ID = 'JobFamilyID',
    JOB_SUBFAMILY_ID = 'JobSubFamilyID',
    REFERENCE_LEVEL = 'ReferenceLevel',
    KF_LEVEL_CODE = 'KF Level Code',
    CREATED_ON = 'Created On',
    MODIFIED_ON = 'Modified On',
    SHORT_PROFILE = 'ShortProfile',
    UNIQUE_ID = 'UniqueID',
    LEVEL = 'Level',
    IMPORTANT = 'Important?',
    TYPE = 'Type',
    TASK_ORDER = 'Task Order',
    TOOL_ORDER = 'Tool Order',
    EXAMPLE_ORDER = 'Example Order',
}

export enum ContentType {
    EXCEL = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

export const ContentTypeExtension = {
    [ContentType.EXCEL]: 'xlsx',
};

export interface HcmSpExportData {
    competencies: BehavioralCompetencyRaw[];
    drivers: DriverRaw[];
    education: EducationRaw[];
    generalExperiences: GeneralExperienceRaw[];
    managerialExperiences: ManagerialExperienceRaw[];
    responsibilities: ResponsibilityRaw[];
    skills: SkillRaw[];
    successProfiles: SpRaw[];
    tasks: TaskRaw[];
    tools: ToolRaw[];
    traits: TraitRaw[];
} 

export interface Competency {
    BehavioralCompetencyName: string;
    BehavioralCompetencyDescription: string;
    BehavioralCompetencyLevel: number;
    BehavioralCompetencyLevelDescription: string;
}

export interface Driver {
    DriverName: string;
    DriverDescription: string;
    DriverScore: number;
}

export interface Education {
    Education: number;
    EducationDescription: string;
    EducationLevel: number;
}

export interface GeneralExperiencies {
    GeneralExperience: string;
    GeneralExperienceDescription: string;
    GeneralExperienceLevel: number;
}

export interface ManagerialExperiencies {
    ManagerialExperience: string;
    ManagerialExperienceDescription: string;
    ManagerialExperienceLevel: number;
}

export interface Responsibility {
    ResponsibilityName: string;
    ResponsibilityDescription: string;
    ResponsibilityLevel: number;
    ResponsibilityLevelDescription: string;
}

export interface Skill {
    SkillName: string;
    SkillDescription: string;
    SkillLevel: number;
    SkillLevelDescription: string;
    SkillComponents: string | null;
}

export interface Trait {
    TraitName: string;
    TraitDescription: string;
    TraitScore: number;
}

export interface SuccessProfile {
    JobID: number;
    behavioralCompetencies: Competency[];
    drivers: Driver[];
    education: any[];
    generalExperiencies: GeneralExperiencies[];
    managerialExperiencies: ManagerialExperiencies[];
    responsibilities: Responsibility[];
    skills: Skill[];
    traits: Trait[];
    // tasks: any[];
    // tools: any[];
}

export interface HcmJson {
    successProfile: SuccessProfile[];
}

export interface HcmJsonExportResponse extends AppResponse<HcmJson> {}

export enum FileStages {
    TRIGGERED = 0,
    INPROGRESS = 1,
    FAILED = 2,
    SUCCESS = 3,
}

export interface HCMExportEvent {
    payload: {
        header: {
            type: string;
            timestamp: string;
            status: string;
            client_id: string;
            request_id_count: number;
            kf1_client_key: string;
        };
        data: {
            request_ids: Record<string, number>;
        };
    };
}

export interface HcmRmqPushResponse {
    message: string;
    exportedSPIds: number[];
    skippedSpIds: number[];
}

export interface HcmCsvExportResponse extends AppResponse<Buffer<ArrayBuffer>> {}

export interface HcmExcelExportResponse extends  AppResponse<Buffer> {}


export type HCMExportResponse<T extends FileFormats> = T extends FileFormats.JSON
    ? HcmJsonExportResponse
    : T extends FileFormats.CSV
    ? HcmCsvExportResponse
    : T extends FileFormats.EXCEL
    ? HcmExcelExportResponse
    : T extends FileFormats.HCM
    ? HcmRmqPushResponse
    : never;