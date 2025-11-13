import { QuestionCategory, QuestionsState } from "./skills.const";

// payloads

export interface IgUpdateSkillQuestionsPayload extends IgSkillCore {
    interviewQuestionLevels: Record<number, IgSkillQuestion[]>;
    potentialUnderuseBehaviorLevels: Record<number, IgSkillQuestion[]>;
    onTargetBehaviorLevels: Record<number, IgSkillQuestion[]>;
}

export interface IgGetMultipleSkillsWithQuestionsPayload {
    skillsIds: number[];
    successProfileId?: number;
    clientId?: number;
    locale?: string;
    questionsOnly?: boolean;
}

// options

export interface GetIgSkillsDetailsOptions {
    clientId: number;
    skillId?: number;
    linkedToCustomSuccessProfile?: boolean;
}

export interface GetIgSkillQuestionsOptions {
    clientId: number;
    skillId: number;
    showStandardData?: boolean;
}

export interface GetSuccessProfileIGSkillsQuestionsOptions {
    clientId: number;
    successProfileId: number;
    skillIds: number[];
    locale: string;
}

export interface SetIgSkillOperationDetailsOptions {
    clientId: number;
    skillId: number;
    isReverted: boolean;
}

// dto

export interface IgSkillQuestionDTO {
    clientId: number;
    skillId: number;
    id: number;
    code: string | null;
    type: string;
    level: number;
    description: string;
    status: string;
    isActive: boolean;
    isCustom: boolean;
    modifiedOn: number | null;
}

export interface SuccessProfileIGSkillQuestionDTO {
    skillId: number;
    type: string;
    description: string;
}

export interface IgSkillDTO {
    clientId: number;
    id: number;
    code: string;
    name: string;
    description: string;
    negativeBehaviourCount: number;
    positiveBehaviourCount: number;
    questionareCount: number;
    isActive: boolean;
    isCustom: boolean;
    modifiedOn: number;
}

// entity

export interface IgSkillCore {
    id: number;
    globalCode: string;
    name: string;
    description: string;
    isActive: boolean;
    isCustom: boolean;
    dateModified: number | null;
}

export interface IgSkill extends IgSkillCore {
    potentialUnderuseBehaviors: number;
    onTargetBehaviors: number;
    interviewQuestions: number;
}

export interface IgSkillWithQuestions extends IgSkill {
    status: QuestionsState;
    interviewQuestionLevels: Record<number, IgSkillQuestion[]>;
    potentialUnderuseBehaviorLevels: Record<number, IgSkillQuestion[]>;
    onTargetBehaviorLevels: Record<number, IgSkillQuestion[]>;
}

export interface IgSkillQuestion {
    id: string | null; // code actually
    type: QuestionCategory;
    description: string;
    levels: number[];
    status: QuestionsState | null;
    dateModified: number | null;
    isActive: boolean | null;
    isCustom: boolean | null;
}

export interface IgSkillDetachedQuestion {
    clientId: number;
    skillId: number;
    id: number;
    code: string | null;
    type: QuestionCategory;
    level: number;
    description: string;
    status: QuestionsState;
    dateModified: number | null;
    isActive: boolean;
    isCustom: boolean;
}

// response

export interface IgSkillsResponse {
    clientId: number;
    skills: {
        skill: IgSkill;
    }[];
}

export interface IgSkillWithQuestionsResponse extends IgSkillWithQuestions {
    clientId: number;
}

export interface IgMultipleSkillsWithQuestionsResponse {
    skills: IgSkillWithQuestionsResponse[];
}

export interface IgSuccessProfileSkillQuestion {
    description: string;
}

export interface IgSuccessProfileSkillQuestionResponse {
    clientId: number;
    id: number;
    interviewQuestions: IgSuccessProfileSkillQuestion[];
    potentialUnderuseBehaviors: IgSuccessProfileSkillQuestion[];
    onTargetBehaviors: IgSuccessProfileSkillQuestion[];
}

export interface IgSuccessProfileSkillsQuestionsResponse {
    skills: IgSuccessProfileSkillQuestionResponse[];
}


export interface IgUpdateSkillResponse {
    operationId: number;
}


export interface IgSkillStagingQuestionDTO {
    operationId: number;
    clientId: number;
    editorId: number;
    skillId: number;
    skillCode: string;
    skillName: string;
    skillDescription: string;
    level: number;
    type: string;
    code: string;
    description: string;
    isEnabled: boolean;
}
