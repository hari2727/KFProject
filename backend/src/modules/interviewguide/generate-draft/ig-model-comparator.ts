import { IgModel } from '../model/ig-model.i';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IgModelComparator {

    areCompetenciesEqual(a: IgModel.Competency, b: IgModel.Competency): boolean {
        return JSON.stringify(this.getComparableCompetency(a)) === JSON.stringify(this.getComparableCompetency(b));
    }

    protected getComparableCompetency(competency: IgModel.Competency): any[] {
        return [
            // competency.dateModified,
            // competency.modifiedBy,
            competency.id,
            competency.globalCode,
            //competency.name,
            competency.description,
            competency.isActive,
            competency.isCustom,
            competency.interviewQuestions,
            competency.potentialUnderuseBehaviors,
            competency.onTargetBehaviors,
            this.getComparableLevelCollection(competency.interviewQuestionLevels),
            this.getComparableLevelCollection(competency.potentialUnderuseBehaviorLevels),
            this.getComparableLevelCollection(competency.onTargetBehaviorLevels),
        ];
    }

    protected getComparableLevelCollection(collection: IgModel.LevelCollection): any[] {
        const plain = [];
        for (const k in collection) {
            plain.push(
                ...collection[k].map(question => [
                    question.description,
                    question.isActive,
                    question.isCustom,
                    [...question.levels].sort(),
                    k,
                ])
            );
        }
        plain.sort((a, b) => a[0].localeCompare(b[0]));
        return plain;
    }
}
