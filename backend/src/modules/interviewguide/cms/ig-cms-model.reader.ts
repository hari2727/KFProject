import { Injectable } from '@nestjs/common';
import { IgModel } from '../model/ig-model.i';
import { IgCmsXmlModel, IgCmsModel } from '../model/ig-cms-model.i';
import { CompetencyType } from '../model/ig-cms-enum';
import { Nullable } from '../../../_shared/types';

@Injectable()
export class IgCmsModelReader {

    mapResponseToCompetencyRoots(response: IgCmsModel.IgCms, competencyType: CompetencyType): IgModel.CompetencyRoot[] {

        const compRoots = response.competencies.map( comp => {

            const interviewQuestionLevels = this.buildLevelCollection(comp.interviewQuestions);
            const interviewQuestions = this.countUniqueLevels(interviewQuestionLevels);
            const potentialUnderuseBehaviorLevels = this.buildLevelCollection(comp.potentialUnderuseBehaviors);
            const potentialUnderuseBehaviors = this.countUniqueLevels(potentialUnderuseBehaviorLevels);
            const onTargetBehaviorLevels = this.buildLevelCollection(comp.onTargetBehaviors);
            const onTargetBehaviors = this.countUniqueLevels(onTargetBehaviorLevels);

            const mapedComp = {
                id: comp.id,
                globalCode: comp.globalCode,
                name: comp.name,
                description: comp.description,
                isActive: comp.isActive,
                isCustom: comp.isCustom,
                dateModified: comp.dateModified,
                interviewQuestionLevels: interviewQuestionLevels,
                potentialUnderuseBehaviorLevels: potentialUnderuseBehaviorLevels,
                onTargetBehaviorLevels: onTargetBehaviorLevels,
                interviewQuestions: interviewQuestions,
                potentialUnderuseBehaviors: potentialUnderuseBehaviors,
                onTargetBehaviors: onTargetBehaviors
                };

            const compRoot: IgModel.CompetencyRoot = {
                status: competencyType === CompetencyType.BASE ? IgModel.Status.BASE : IgModel.Status.PUBLISHED,
                competency: mapedComp
            };
            return compRoot;
        } )
        return compRoots;
    }

    getCompetencyById(response: IgCmsModel.IgCms, competencyId: string): Nullable<IgModel.Competency>  {
        const comp = response.competencies.find( comp => comp.id === competencyId);

            const interviewQuestionLevels = this.buildLevelCollection(comp.interviewQuestions);
            const interviewQuestions = this.countUniqueLevels(interviewQuestionLevels);
            const potentialUnderuseBehaviorLevels = this.buildLevelCollection(comp.potentialUnderuseBehaviors);
            const potentialUnderuseBehaviors = this.countUniqueLevels(potentialUnderuseBehaviorLevels);
            const onTargetBehaviorLevels = this.buildLevelCollection(comp.onTargetBehaviors);
            const onTargetBehaviors = this.countUniqueLevels(onTargetBehaviorLevels);

            const mapedComp = {
                id: comp.id,
                globalCode: comp.globalCode,
                name: comp.name,
                description: comp.description,
                isActive: comp.isActive,
                isCustom: comp.isCustom,
                dateModified: comp.dateModified,
                interviewQuestionLevels: interviewQuestionLevels,
                potentialUnderuseBehaviorLevels: potentialUnderuseBehaviorLevels,
                onTargetBehaviorLevels: onTargetBehaviorLevels,
                interviewQuestions: interviewQuestions,
                potentialUnderuseBehaviors: potentialUnderuseBehaviors,
                onTargetBehaviors: onTargetBehaviors
                };

            return mapedComp;
    }

    mapXmlResponseToCompetencyRoots(response: IgCmsXmlModel.Response): IgModel.CompetencyRoot[] {
        return (
            Object.keys(response.sections.competencies.components.competencies.content.questionContent)
                .map(key => this.getCompetencyByIdXml(response, key))
                .filter(Boolean)
                .map(competency => ({ status: IgModel.Status.PUBLISHED, competency }))
        );
    }

    getCompetencyByIdXml(response: IgCmsXmlModel.Response, competencyId: string): Nullable<IgModel.Competency>  {
        const definitions = response.sections.competencies.components.competencies.content.definitions;
        const questionContent = response.sections.competencies.components.competencies.content.questionContent;
        if (!questionContent[competencyId] || !definitions[competencyId]) {
            // this.logger.log(`IG competency ${competencyId} not found in CMS`);
            return null;
        }
        const questionsData = this.getScopedQuestions(questionContent[competencyId], competencyId);

        const interviewQuestionLevels = this.buildLevelCollection(questionsData.interviewQuestions);
        const interviewQuestions = this.countUniqueLevels(interviewQuestionLevels);
        const potentialUnderuseBehaviorLevels = this.buildLevelCollection(questionsData.potentialUnderuseBehaviors);
        const potentialUnderuseBehaviors = this.countUniqueLevels(potentialUnderuseBehaviorLevels);
        const onTargetBehaviorLevels = this.buildLevelCollection(questionsData.onTargetBehaviors);
        const onTargetBehaviors = this.countUniqueLevels(onTargetBehaviorLevels);

        return {
            id: competencyId,
            globalCode: competencyId,
            name: definitions[competencyId].name,
            description: definitions[competencyId].definition,
            isActive: true,
            isCustom: false,
            dateModified: '',
            interviewQuestionLevels,
            potentialUnderuseBehaviorLevels,
            onTargetBehaviorLevels,
            interviewQuestions,
            onTargetBehaviors,
            potentialUnderuseBehaviors
        };
    }

    protected getScopedQuestions(stages: IgCmsXmlModel.StageCollection, globalKey: string): {
        interviewQuestions: IgModel.LevelQuestionary[];
        potentialUnderuseBehaviors: IgModel.LevelQuestionary[];
        onTargetBehaviors: IgModel.LevelQuestionary[];
    } {
        const interviewQuestions = this.getQuestions(
            globalKey,
            stages.stage1.questions,
            stages.stage2.questions,
            stages.stage3.questions,
            stages.stage4.questions,
        );
        const potentialUnderuseBehaviors = this.getQuestions(
            globalKey,
            stages.stage1.themesNegative,
            stages.stage2.themesNegative,
            stages.stage3.themesNegative,
            stages.stage4.themesNegative,
        );
        const onTargetBehaviors = this.getQuestions(
            globalKey,
            stages.stage1.themesPositive,
            stages.stage2.themesPositive,
            stages.stage3.themesPositive,
            stages.stage4.themesPositive,
        );
        return {
            interviewQuestions,
            potentialUnderuseBehaviors,
            onTargetBehaviors,
        };
    }

    protected getQuestions(
        globalKey: string,
        stage1: IgCmsXmlModel.QuestionCollection | IgCmsXmlModel.TeamCollection,
        stage2: IgCmsXmlModel.QuestionCollection | IgCmsXmlModel.TeamCollection,
        stage3: IgCmsXmlModel.QuestionCollection | IgCmsXmlModel.TeamCollection,
        stage4: IgCmsXmlModel.QuestionCollection | IgCmsXmlModel.TeamCollection,
    ): IgModel.LevelQuestionary[] {
        const questions: {[description: string]: IgModel.LevelQuestionary} = {};

        for (const [key, value] of Object.entries(stage1)) {
            questions[value] = questions[value] || {
                id: `${globalKey}-stage1-${key}-12`,
                description: value,
                isActive: true,
                isCustom: false,
                levels: [],
            };
            questions[value].levels.push(1,2);
        }
        for (const [key, value] of Object.entries(stage2)) {
            questions[value] = questions[value] || {
                id: `${globalKey}-stage2-${key}-34`,
                description: value,
                isActive: true,
                isCustom: false,
                levels: [],
            };
            questions[value].levels.push(3,4);
        }
        for (const [key, value] of Object.entries(stage3)) {
            questions[value] = questions[value] || {
                id: `${globalKey}-stage3-${key}-56`,
                description: value,
                isActive: true,
                isCustom: false,
                levels: [],
            };
            questions[value].levels.push(5,6);
        }
        for (const [key, value] of Object.entries(stage4)) {
            questions[value] = questions[value] || {
                id: `${globalKey}-stage4-${key}-78`,
                description: value,
                isActive: true,
                isCustom: false,
                levels: [],
            };
            questions[value].levels.push(7,8);
        }
        return Object.values(questions);
    }

    protected buildLevelCollection(questions: IgModel.LevelQuestionary[]): IgModel.LevelCollection {
        const result = {};
        (questions || []).forEach(question => {
            question.levels.forEach(key => {
                result[key] = result[key] || [];
                result[key].push(question);
            });
        });
        return result;
    }

    protected countUniqueLevels(levels: IgModel.LevelCollection): number {
        return new Set(Object.values(levels).reduce((a, b) => [...a, ...b.map(i => i.id)], [])).size;
    }

}
