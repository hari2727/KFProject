import { IgModel as S } from '../model/ig-model.i';
import { clone, generateUUIDv4 } from '../../../common/common.utils';
import { IgModelComparator } from './ig-model-comparator';
import { Injectable } from '@nestjs/common';
import { AppCode as ec } from '../../../app.const';
import { IgCmsModel } from '../model/ig-cms-model.i';
import { CmsApi as cms } from '../model/ig-cms-enum';
import { MapErrors } from '../../../_shared/error/map-errors.decorator';
import { LogErrors } from '../../../_shared/log/log-errors.decorator';
import { Nullable } from '../../../_shared/types';

@Injectable()
export class IgDraftTransformer {
    constructor(protected comparator: IgModelComparator) {}

    @MapErrors({ errorCode: ec.EXTERNAL_CALL_ERR })
    @LogErrors()
    generateNewDraft(
        competencyId: string,
        clientId: number,
        locale: string,
        userId: string,
        origCompPayload: S.Competency,
        igDraftOrig: S.Draft,
        igCmsOrig: S.CompetencyRoot[],
        igBaseOrig: S.CompetencyRoot[],
    ): S.Draft {
            const igDraft = clone<S.Draft>(igDraftOrig),
                igCms = clone<S.CompetencyRoot[]>(igCmsOrig),
                igBase = clone<S.CompetencyRoot[]>(igBaseOrig);

            const generatedDraft = this.generateDraftTemplate(clientId, locale, userId, igDraft, igCms);
            const draftToSave = this.removeCompetencyFromDraft(competencyId, generatedDraft);
            const newCompetency = this.enrichCompetencyPayload(origCompPayload, userId);
            const baseCompetency = igBase.map(root => root.competency).find(comp => comp.id === competencyId);
            const isBase = this.comparator.areCompetenciesEqual(newCompetency, baseCompetency);
            if (isBase) newCompetency.dateModified = '';
            draftToSave.competencies.push({
                status: isBase ? S.Status.BASE : S.Status.MODIFIED,
                competency: newCompetency,
            });
            return draftToSave;
    }

    generateDraftTemplate(clientId: number, locale: string, userId: string, igDraft: Nullable<S.Draft>, igCms: S.CompetencyRoot[]): S.Draft {
        let draftToSave: S.Draft;

        if (!igDraft) {
            draftToSave = {
                clientId: clientId,
                locale: locale,
                createdOn: this.getTimeString(),
                createdBy: this.convertUserId(userId),
                status: S.Status.MODIFIED,
                competencies: clone<S.CompetencyRoot[]>(igCms),
            };
        } else {
            draftToSave = clone<S.Draft>(igDraft);
            draftToSave.status = S.Status.MODIFIED;
        }

        return draftToSave;
    }

    protected removeCompetencyFromDraft(competencyId: string, draftToSave: S.Draft): S.Draft {
        const competencyIndex = draftToSave.competencies.findIndex(comp => comp.competency.id === competencyId);
        if (competencyIndex !== -1) {
            draftToSave.competencies.splice(competencyIndex, 1);
        }
        return draftToSave;
    }

    enrichCompetencyPayload(payload: S.Competency, userId: string): S.Competency {
        payload.dateModified = this.getTimeString();
        payload.modifiedBy = this.convertUserId(userId);

        const payloadLevels = [payload.interviewQuestionLevels, payload.onTargetBehaviorLevels, payload.potentialUnderuseBehaviorLevels];
        payloadLevels.forEach(levels => this.mutateSetIdsToLevelEntities(levels));

        payload.interviewQuestions = this.countUniqueLevels(payload.interviewQuestionLevels);
        payload.onTargetBehaviors = this.countUniqueLevels(payload.onTargetBehaviorLevels);
        payload.potentialUnderuseBehaviors = this.countUniqueLevels(payload.potentialUnderuseBehaviorLevels);

        return payload;
    }

    protected mutateSetIdsToLevelEntities(levels: S.LevelCollection): S.LevelCollection {
        const idDescMap = new Map<string, string>();
        Object.values(levels).forEach(level =>
            level.forEach(question => {
                const desc = question.description;
                if (!idDescMap.has(desc)) {
                    idDescMap.set(desc, question.id || generateUUIDv4());
                }
                question.id = idDescMap.get(desc);
            }),
        );
        return levels;
    }

    protected countUniqueLevels(levels: S.LevelCollection): number {
        const set: Set<string> = new Set();
        for (const lvl in levels) {
            levels[lvl].forEach(question => set.add(question.description));
        }
        return set.size;
    }

    generateEmptyCompetency(id: string, globalCode: string, name: string, desc: string, isCustom: boolean, userId: string): S.Competency {
        return {
            id: id,
            globalCode: globalCode,
            name: name,
            description: desc,
            isActive: true,
            isCustom: isCustom,
            interviewQuestionLevels: {},
            potentialUnderuseBehaviorLevels: {},
            onTargetBehaviorLevels: {},
            interviewQuestions: 0,
            potentialUnderuseBehaviors: 0,
            onTargetBehaviors: 0,
            dateModified: this.getTimeString(),
            modifiedBy: this.convertUserId(userId),
        };
    }

    draftToCmsStructure(draft: S.Draft): IgCmsModel.IgCms {
        const IgCms: IgCmsModel.IgCms = {
            id: cms.GET_IG_CLIENT_ID_PREFIX + draft.clientId + cms.CLIENT_ID_POSTFIX,
            lang: 'en-US',
            competencies: [],
        };
        IgCms.competencies = draft.competencies.map(compR => {
            const igComp: IgCmsModel.Competency = {
                id: compR.competency.id,
                globalCode: compR.competency.globalCode,
                name: compR.competency.name,
                description: compR.competency.description,
                isActive: compR.competency.isActive,
                isCustom: compR.competency.isCustom,
                dateModified: compR.competency.dateModified,
                interviewQuestions: [],
                potentialUnderuseBehaviors: [],
                onTargetBehaviors: [],
            };
            igComp.interviewQuestions = this.levelsToCmsStructure(compR.competency.interviewQuestionLevels);
            igComp.potentialUnderuseBehaviors = this.levelsToCmsStructure(compR.competency.potentialUnderuseBehaviorLevels);
            igComp.onTargetBehaviors = this.levelsToCmsStructure(compR.competency.onTargetBehaviorLevels);
            return igComp;
        });
        return IgCms;
    }

    levelsToCmsStructure(levelCol: S.LevelCollection): S.LevelQuestionary[] {
        let questions = [];
        Object.values(levelCol).forEach((level, levelIndex) =>
            level.forEach(q => {
                const questionWithActive = questions.findIndex(que => que.id === q.id && q.isActive === que.isActive);
                if (questionWithActive >= 0) {
                    q.levels.push(levelIndex + 1);
                    questions[questionWithActive].levels.push(levelIndex + 1);
                } else {
                    q.levels = [levelIndex + 1];
                    questions.push(q);
                }
            }),
        );
        return questions;
    }

    changeStatus(source: S.Draft, status: S.Status, userId: string): S.Draft {
        const willChangeStatus = source.status !== status || source.status === S.Status.BASE;
        source.status = status;
        if (source.competencies && willChangeStatus) {
            source.competencies.forEach(competencyRoot => this.changeCompetencyStatus(competencyRoot, status, userId));
        }
        return source;
    }

    changeCompetencyStatus(source: S.CompetencyRoot, status: S.Status, userId: string): S.CompetencyRoot {
        const willChangeStatus = source.status !== status,
            sourceIsBase = source.status === S.Status.BASE;
        if (sourceIsBase) {
            source.competency.modifiedBy = null;
            source.competency.dateModified = '';
        } else if (willChangeStatus) {
            source.status = status;
            source.competency.modifiedBy = this.convertUserId(userId);
            source.competency.dateModified = this.getTimeString();
        }
        return source;
    }

    protected getTimeString(): string {
        return String(new Date().getTime());
    }

    protected convertUserId(userId: string): number {
        return +userId;
    }
}
