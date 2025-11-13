import { IgModel } from './ig-model.i';

export namespace IgUiModel {

    export interface Draft {
        status: IgModel.Status;
        competencies: IgModel.CompetencyRoot[];
    }

    export interface UICompetency extends IgModel.Competency {
        status: IgModel.Status;
    }
}
