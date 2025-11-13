import { IgCmsConnection } from './cms/ig-cms-connection.service';
import { IgDraftTransformer } from './generate-draft/ig-draft-generator';
import { IgModel as S } from './model/ig-model.i';
import { IgUiModel as U } from './model/ig-ui-model.i';
import { INTERVIEW_GUIDE_MODEL } from './database/ig-mongoose.config';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { AppCode as ec } from '../../app.const';
import { IgSplitInterviewPostBody } from './model/ig-split-interview-post-body.i';
import { Model } from 'mongoose';
import { QueryProps } from '../../common/common.interface';
import { clone, okResponse } from '../../common/common.utils';
import { IgMssqlService } from './database/ig-mssql-service';
import { CustomContent } from './model/ig-mssql.i';
import { IgStatus } from './model/ig-status.enum';
import { CompetencyType } from './model/ig-cms-enum';
import { IgCustomCompetenciesService } from './custom-competencies/ig-custom-competencies.service';
import { IgDraftTransformerCustomCompetencies } from './generate-draft/ig-draft-generator-custom-competencies';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { MapErrors } from '../../_shared/error/map-errors.decorator';
import { AppError } from '../../_shared/error/app-error';
import { Nullable } from '../../_shared/types';
import { MongoDbConnectionName } from '../../models/mongo-db.const';
import { safeString } from '../../_shared/safety';

@Injectable()
export class IgService {

    protected isCustomCompetenciesEnabled = false;
    constructor(
        protected cmsConnection: IgCmsConnection,
        protected draftTransformer: IgDraftTransformer,
        protected mssqlService: IgMssqlService,
        protected customComps: IgCustomCompetenciesService, //custom competencies feature disabled for not
        protected draftTransformerCc: IgDraftTransformerCustomCompetencies,
        @InjectModel(INTERVIEW_GUIDE_MODEL, MongoDbConnectionName.SuccessProfile)
        protected modelDraft: Model<S.Draft>,
    ) {
    }

    /**
     *
     *
     * @method splitInterview
     *    Utilizes length for each array from eachInterviewLength()
     *             fills data in array using addCompToInterview()
     *    constructs endpoints from 2 to 6;
     */
    async splitInterview(query: QueryProps.Default, body: IgSplitInterviewPostBody) {
            const splits: Object[] = [];
            for (let i = 2; i <= 6; i++) {
                const eachLength = this.eachInterviewLength(body.compData, i);
                const eachInterview = this.addCompToInterview(eachLength.elements, body.compData, body.masterUrl);
                const element = {
                    urls: eachInterview,
                    counts: i,
                    hasDuplicates: eachLength.hasDuplicates,
                };
                splits.push(element);
            }
            return {
                master: {
                    url: body.masterUrl,
                },
                splits,
            };
    }

    /**
     *
     *
     * @method getEachLength
     *       returns the length of each array which are used to form urls
     *       example {
     *           hasDuplicate : false,
     *           elements : [2,4,4]
     *       }
     */
    eachInterviewLength(compData: string[], interviews: number) {
        const { length } = compData;
        const result = {
            elements: [length],
            hasDuplicates: false,
        };

        const initialValue = Math.ceil(length / interviews);

        result.elements = Array.from({ length: interviews }, () => initialValue);

        let total = 0;

        for (let i = 0; i < result.elements.length; i++) {
            total += result.elements[i];
            if (result.elements[i] < 2) {
                result.elements[i] = 2;
            }
        }

        let diff = total - length;

        if (diff !== 0) {
            while (diff) {
                const index = interviews - 1 - --diff;
                if (result.elements[index] > 2) {
                    result.elements[index]--;
                } else {
                    result.hasDuplicates = true;
                }
            }
        }

        if (compData.length === interviews || length === 0) {
            result.hasDuplicates = true;
        }

        return result;
    }

    /**
     *
     * @method addCompToInterview
     * return url for interviews
     *     example ["https://","https://"]
     */
    addCompToInterview(eachLength: number[], compData: string[], masterUrl: string) {
        const result: Object[][] = Array.from({ length: eachLength.length }, () => []);
        let duplicateIndex = 0;
        let startingPoint = 0;
        const interviewWithComp: string[] = [];
        const repeatDuplicate = () => {
            /*
                in case if the compData length is 2 we need this method repeat duplicate process
            */
            duplicateIndex = 1;
            return 0;
        };

        for (let i = 0; i < eachLength.length; i++) {
            for (let j = startingPoint; j < eachLength[i] + startingPoint; j++) {
                const value = compData[j] || compData[duplicateIndex++] || compData[repeatDuplicate()];
                result[i].push(value);
            }
            startingPoint += eachLength[i];

            let join = '';

            if (compData.length) {
                join = '=' + result[i].join('%7C');
            }

            const url = masterUrl + '&o_competencies' + join;
            interviewWithComp[i] = url;
        }
        return interviewWithComp;
    }

    @LogErrors()
    async getInterviewGuideCompetency(competencyId: string, clientId: string, locale: string): Promise<U.UICompetency | {}> {
        const cmsCompetencyPromise = this.cmsConnection.getCompetencyById(clientId, competencyId, CompetencyType.STANDART);
        const cmsBaseCompetencyPromise = this.cmsConnection.getCompetencyById(clientId, competencyId, CompetencyType.BASE);
        const localCompetencyRoot = await this.getInterviewGuideDraftCompetencyRoot(competencyId, clientId, locale);

        // if the IG draft's status is not 'published', then we will return IG draft
        if ((localCompetencyRoot?.status && localCompetencyRoot?.status !== S.Status.PUBLISHED) || localCompetencyRoot?.draftStatus === S.Status.MODIFIED) {
            return Object.assign(localCompetencyRoot.competency, { status: localCompetencyRoot.status });
        }
        // if there is no unpublished changes in IG draft - we will get data from CMS
        const cmsCompetency = await cmsCompetencyPromise;
        if (cmsCompetency) {
            return Object.assign(this.mergeQuestionLevels(cmsCompetency), { status: S.Status.PUBLISHED });
        }
        // if client never published competency return Base content
        const cmsBaseCompetency = await cmsBaseCompetencyPromise;
        if (cmsBaseCompetency) {
            return Object.assign(cmsBaseCompetency, { status: S.Status.BASE });
        }
        return {};
    }

    mergeQuestionLevels(competency: S.Competency): S.Competency {
        const allQuestions = Object.values(competency.interviewQuestionLevels).flat();
        const groupedQuestions = [];
        allQuestions.forEach(question => {
            const index = groupedQuestions.findIndex(group => group.id === question.id);
            if (index >= 0) {
                groupedQuestions[index].levels = [...new Set([...groupedQuestions[index].levels, ...question.levels])];
            } else {
                groupedQuestions.push(question);
            }
        });

        for (let level in competency.interviewQuestionLevels) {
            if (competency.interviewQuestionLevels.hasOwnProperty(level)) {
                competency.interviewQuestionLevels[level].forEach(question => {
                    const index = groupedQuestions.findIndex(group => group.id === question.id);
                    if (index >= 0) {
                        question.levels = groupedQuestions[index].levels;
                    }
                });
            }
        }
        return competency;
    }

    @LogErrors()
    async getInterviewGuideCompetencies(clientId: string, locale: string, userId: string): Promise<U.Draft> {
        const igCms = this.cmsConnection.getInterviewGuides(clientId, CompetencyType.STANDART);
        const igCmsBase = this.cmsConnection.getInterviewGuides(clientId, CompetencyType.BASE);
        const igDraft = await this.getInterviewGuideDraft(+clientId, locale);
        //No need to wait CMS if we have modified
        if (igDraft && igDraft.status !== S.Status.PUBLISHED) {
            const { status, competencies } = igDraft;
            return { status: status, competencies: competencies };
        }
        //if there is no Draft at all but client have Custom Content - we should create draft with Custom Content
        if (!igDraft) {
            await this.upsertDraftWithCustomContent(clientId, locale, userId);
            const igDraftNew = await this.getInterviewGuideDraft(+clientId, locale);
            if (igDraftNew) {
                const { status, competencies } = igDraftNew;
                return { status: status, competencies: competencies };
            }
        }

        if (await igCms) return { status: S.Status.PUBLISHED, competencies: await igCms };
        //if client never published anything return Base content
        return { status: S.Status.BASE, competencies: await igCmsBase };
    }

    @LogErrors()
    protected async getInterviewGuideDraft(clientId: number, locale: string): Promise<Nullable<S.Draft>> {
            const draft = await this.modelDraft.findOne({ clientId: clientId, locale: locale }).lean();
            if (draft?.competencies?.length > 1) {
                draft.competencies.sort((a, b) => a.competency.name.localeCompare(b.competency.name));
            }
            return draft;
    }

    @LogErrors()
    protected async getInterviewGuideDraftCompetencyRoot(competencyId: string, clientId: string, locale: string): Promise<Nullable<S.CompetencyRoot>> {
            const igDraft = await this.getInterviewGuideDraft(+clientId, locale);
            if (igDraft) {
                const competencyRoot = igDraft.competencies.find(comp => comp.competency.id === competencyId);
                if (competencyRoot) {
                    competencyRoot.draftStatus = igDraft.status;
                    return competencyRoot;
                }
            }
            return null;
    }

    @LogErrors()
    async putInterviewGuideDraft(competencyId: string, clientIdStr: string, locale: string, userId: string, updatedComp: S.Competency): Promise<any> {
        const clientId = +clientIdStr;
        if (updatedComp.isCustom === false) {
            const igDraft = await this.getInterviewGuideDraft(clientId, locale);
            //if there is no draft we need to get original content from CMS as base for future draft
            let igCms: S.CompetencyRoot[] = [];
            if (!igDraft) {
                igCms = await this.getCmsStandartOrBaseContent(clientIdStr);
            }
            const baseContent = await this.cmsConnection.getInterviewGuides(clientIdStr, CompetencyType.BASE);

            const draftToSave = this.draftTransformer.generateNewDraft(competencyId, clientId, locale, userId, updatedComp, igDraft, igCms, baseContent);
            if (!igDraft) {
                await this.modelDraft.insertMany(draftToSave);
            } else {
                // await this.modelDraft.updateOne({ clientId: clientId, locale: locale }, draftToSave);
                try {
                    await this.modelDraft.deleteMany({ clientId: clientId, locale: locale });
                    await this.modelDraft.insertMany(draftToSave);
                } catch (e) {
                    await this.modelDraft.insertMany(igDraft);
                }
            }
            return okResponse;
        } else if (updatedComp.isCustom === true && this.isCustomCompetenciesEnabled) {
            await this.customComps.updateCustomCompetencyData(updatedComp, clientId, locale, userId);
        }
        return okResponse;
    }

    @LogErrors()
    async publishInterviewGuideDraft(clientId: string, locale: string, userId: string): Promise<any> {
        const clientIdConverted = +clientId;
        const draft = await this.getInterviewGuideDraft(clientIdConverted, locale);
        if (draft) {
            const changed = this.draftTransformer.changeStatus(clone<S.Draft>(draft), S.Status.PUBLISHED, userId);
            const igForPublish = this.draftTransformer.draftToCmsStructure(draft);
            await this.cmsConnection.publishInterviewGuide(igForPublish);
            // await this.modelDraft.updateOne({ clientId: clientIdConverted, locale }, changed);
            try {
                await this.modelDraft.deleteMany({ clientId: clientIdConverted, locale });
                await this.modelDraft.insertMany(changed);
            } catch (e) {
                await this.modelDraft.insertMany(draft);
            }
        }
        return okResponse;
    }

    @MapErrors({ errorCode: ec.COMPETENCY_NOT_FOUND })
    @LogErrors()
    async getCompetencyBaseContent(competencyId: string, clientId: string, locale: string): Promise<U.UICompetency | {}> {
            const [localCompetencyRoot, competency] = await Promise.all([
                this.getInterviewGuideDraftCompetencyRoot(competencyId, clientId, locale),
                this.cmsConnection.getCompetencyById(clientId, competencyId, CompetencyType.BASE),
            ]);
            if (!competency) {
                throw new AppError(safeString(`Unable to locate competency [id:${competencyId}]`), 204, { errorCode: ec.COMPETENCY_NOT_FOUND });
            }
            competency.name = localCompetencyRoot?.competency?.name || competency.name;
            return Object.assign(competency, { status: S.Status.BASE }) || {};
    }

    @MapErrors({ errorCode: ec.COMPETENCY_NOT_FOUND })
    @LogErrors()
    async upsertDraftWithCustomContent(clientIdStr: string, locale: string, userId: string): Promise<any> {
            const clientId = +clientIdStr;
            const customContent = await this.mssqlService.getCustomComps(clientId, locale);
            if (customContent) {
                const igDraft = await this.getOrCreateStandartDraft(clientId, locale, userId);
                if (this.isCustomCompetenciesEnabled) await this.customComps.mergeCustomCompetencies(customContent, clientId, locale, userId);
                await this.mergeStandartCompetencies(igDraft, customContent, clientId, locale);
            }
            return okResponse;
    }

    @LogErrors()
    protected async getOrCreateStandartDraft(clientId: number, locale: string, userId: string): Promise<S.Draft> {
            let igDraft = await this.getInterviewGuideDraft(clientId, locale);
            if (!igDraft) {
                const igCms = await this.getCmsStandartOrBaseContent(String(clientId));
                const generatedDraft = this.draftTransformer.generateDraftTemplate(clientId, locale, userId, igDraft, igCms);
                igDraft = generatedDraft;
                await this.modelDraft.insertMany(generatedDraft);
            }
            return igDraft;
    }

    @LogErrors()
    protected async mergeStandartCompetencies(igDraft: S.Draft, customContent: CustomContent[], clientId: number, locale: string) {
            for (const custCont of customContent) {
                if (!+custCont.CustomCompetencyFlag && custCont.GlobalSubCategoryCode) {
                    custCont.GlobalSubCategoryCode = custCont.GlobalSubCategoryCode.toLowerCase();
                    const compIndex = igDraft.competencies.findIndex(comp => comp.competency.globalCode === custCont.GlobalSubCategoryCode);
                    const draftComp = igDraft.competencies[compIndex]?.competency;
                    if (draftComp) {
                        if (draftComp.name !== custCont.CompetencyName || draftComp.isActive !== !!+custCont.isActive) {
                            draftComp.name = custCont.CompetencyName;
                            draftComp.isActive = !!+custCont.isActive;
                            igDraft.status = IgStatus.MODIFIED;
                            await this.modelDraft.updateOne({ clientId: clientId, locale: locale }, igDraft);
                        }
                    }
                }
            }
    }

    @LogErrors()
    protected async getCmsStandartOrBaseContent(clientIdStr: string): Promise<S.CompetencyRoot[]> {
            let igCms: S.CompetencyRoot[];
            igCms = await this.cmsConnection.getInterviewGuides(clientIdStr, CompetencyType.STANDART);
            if (!igCms) igCms = await this.cmsConnection.getInterviewGuides(clientIdStr, CompetencyType.BASE);
            return igCms;
    }

    @LogErrors()
    protected async getIgDraftWithCustomContent(clientId: number, locale: string): Promise<Nullable<S.Draft>> {
            const [draft, customContent] = await Promise.all([
                this.getInterviewGuideDraft(clientId, locale),
                this.customComps.getIgCustomContent(clientId, locale),
            ]);
            return customContent ? this.draftTransformerCc.enrichDraftWithCustomComps(draft, customContent) : draft;
    }
}
