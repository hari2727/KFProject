import { IgStatus } from './ig-status.enum';

export namespace IgModel {

    export interface Draft {
        clientId: number;
        locale: string;
        createdOn: string;
        createdBy: number;
        status: Status;
        competencies: IgModel.CompetencyRoot [];
    }

    export interface CompetencyRoot {
        status: Status;
        draftStatus?: Status;
        competency: Competency;
    }

    export interface Competency {
        id: string;
        globalCode: string;
        name: string;
        description: string;
        isActive: boolean;
        isCustom: boolean;
        interviewQuestionLevels: LevelCollection;
        potentialUnderuseBehaviorLevels: LevelCollection;
        onTargetBehaviorLevels: LevelCollection;
        interviewQuestions: number;
        potentialUnderuseBehaviors: number;
        onTargetBehaviors: number;
        dateModified: string;
        modifiedBy?: number;
    }

    export interface LevelCollection {
        [key: string]: LevelQuestionary[];
    }

    export interface LevelQuestionary {
        id: string;
        description: string;
        isActive: boolean;
        isCustom: boolean;
        levels: number[];
        sectionName?: string; //@TODO temp fix, remove all occurence when UI no longer sent this attribute to PUT payload
    }

    export import Status = IgStatus;
}

export namespace CustomContentModel {
    export interface CompetencyRoot {
        clientId: number;
        locale: string;
        status: IgModel.Status;
        competency: IgModel.Competency;
    }

}