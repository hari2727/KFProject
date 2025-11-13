import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../../logger';
import { IgSkillsDataService } from './skills-data-service';
import {
    IgGetMultipleSkillsWithQuestionsPayload,
    IgMultipleSkillsWithQuestionsResponse,
    IgSkillDetachedQuestion,
    IgSkillQuestion,
    IgSkillsResponse,
    IgSkillStagingQuestionDTO,
    IgSkillWithQuestions,
    IgSkillWithQuestionsResponse,
    IgSuccessProfileSkillQuestionResponse,
    IgSuccessProfileSkillsQuestionsResponse,
    IgUpdateSkillQuestionsPayload,
    IgUpdateSkillResponse
} from './skills-service.types';
import { IgSkillsMapperService } from './skills-mapper-service';
import { QuestionCategory, QuestionsState } from './skills.const';
import { compareAlphaNumericSubsets } from '../../../common/compare';
import { isValidLocale } from '../../../common/common.utils';
import { LogErrors } from '../../../_shared/log/log-errors.decorator';
import { Loggers } from '../../../_shared/log/loggers';
import { isPositiveInteger } from '../../../_shared/is';

@Injectable()
export class IgSkillsService {
    protected logger: LoggerService;

    constructor(
        protected dataService: IgSkillsDataService,
        protected mapperService: IgSkillsMapperService,
        protected loggers: Loggers,
    ) {
        this.logger = loggers.getLogger(IgSkillsService.name);
    }

    @LogErrors()
    async getSkills(clientId: number, linkedToCustomSuccessProfile: boolean): Promise<IgSkillsResponse> {
            if (!clientId || clientId < 1) {
                throw 'Invalid clientId';
            }

            return {
                clientId,
                skills: (await this.dataService.getSkillDTOs({
                    clientId,
                    linkedToCustomSuccessProfile,
                })).map(i => ({
                    skill: this.mapperService.mapSkillDTO(i)
                }))
            };
    }

    @LogErrors()
    async getSkillWithQuestions(clientId: number, skillId: number, locale?: string): Promise<IgSkillWithQuestionsResponse> {
            const skill = await this.getSkill(clientId, skillId);
            const detachedQuestions = (
                await this.dataService.getSkillQuestionDTOs({
                    clientId,
                    skillId,
                })
            ).map(i => this.mapperService.mapSkillQuestionDTO(i))

            this.fillSkillWithQuestions(skill, detachedQuestions);

            return {
                clientId,
                ...this.sortIgSkillDetails(skill)
            };
    }

    @LogErrors()
    async getSkillWithStandardQuestions(clientId: number, skillId: number): Promise<IgSkillWithQuestionsResponse> {
            const skill = await this.getSkill(clientId, skillId);
            const detachedQuestions = (
                await this.dataService.getSkillQuestionDTOs({
                    clientId,
                    skillId,
                    showStandardData: true
                })
            ).map(i => this.mapperService.mapSkillQuestionDTO(i))

            this.fillSkillWithQuestions(skill, detachedQuestions);

            {
                const modificationDates: number[] = [];
                const questionTypes: { [id: string]: QuestionCategory } = {};
                for (const q of detachedQuestions) {
                    questionTypes[ q.id ] = q.type;
                    if (q.dateModified) {
                        modificationDates.push(q.dateModified);
                    }
                }

                const usedTypes = Object.values(questionTypes);
                skill.onTargetBehaviors = usedTypes.filter(i => i === QuestionCategory.Positive).length;
                skill.potentialUnderuseBehaviors = usedTypes.filter(i => i === QuestionCategory.Negative).length;
                skill.interviewQuestions = usedTypes.filter(i => i === QuestionCategory.Questionnaire).length
                    + skill.onTargetBehaviors
                    + skill.potentialUnderuseBehaviors;

                skill.dateModified = modificationDates.length
                    ? Math.max(...modificationDates)
                    : null;
            }

            return {
                clientId,
                ...this.sortIgSkillDetails(skill)
            };
    }

    async getMultipleSkillsWithQuestions(clientId: number, locale: string, body: IgGetMultipleSkillsWithQuestionsPayload): Promise<IgMultipleSkillsWithQuestionsResponse> {
        const skills: IgSkillWithQuestionsResponse[] = [];
        for (const skillId of body.skillsIds) {
            try {
                const skill = await this.getSkillWithQuestions(clientId, skillId);
                skills.push(skill);
            } catch (e) {
                this.logger.error('Error in getMultipleSkillsWithQuestions', e);
            }
        }
        return {
            skills
        };
    }

    @LogErrors()
    async getSuccessProfileSkillsQuestions(defaultClientId: number, defaultLocale: string, body: IgGetMultipleSkillsWithQuestionsPayload): Promise<IgSuccessProfileSkillsQuestionsResponse> {
            if (body.clientId === undefined) {
                body.clientId = defaultClientId;
            }
            const clientId = Number(body.clientId);
            if (!clientId || clientId < 1) {
                throw 'Invalid clientId';
            }

            if (body.locale === undefined) {
                body.locale = defaultLocale;
            }
            const locale = String(body.locale);
            if (!isValidLocale(locale)) {
                throw 'Invalid locale';
            }

            if (body.successProfileId === undefined) {
                throw 'Missing successProfileId';
            }
            const successProfileId = Number(body.successProfileId);
            if (!isPositiveInteger(successProfileId)) {
                throw 'Invalid successProfileId';
            }

            if (body.skillsIds === undefined) {
                throw 'Missing skillsIds';
            }
            if (!Array.isArray(body.skillsIds)) {
                throw 'Invalid skillsIds';
            }

            const skillIds = body.skillsIds.map(Number);
            if (skillIds.find(i => !isPositiveInteger(i))) {
                throw 'Invalid skillId';
            }

            const skillsMap = {};

            if (body.skillsIds.length) {
                const questions = await this.dataService.getSuccessProfileIGSkillsQuestionDTOs({
                    clientId,
                    skillIds,
                    successProfileId,
                    locale
                });

                for (const question of questions) {
                    const skill: IgSuccessProfileSkillQuestionResponse = (skillsMap[question.skillId] = skillsMap[question.skillId] || {
                        clientId,
                        id: question.skillId,
                        interviewQuestions: [],
                        onTargetBehaviors: [],
                        potentialUnderuseBehaviors: [],
                    } as IgSuccessProfileSkillQuestionResponse);

                    const mountPoint =
                        question.type === QuestionCategory.Questionnaire ? skill.interviewQuestions :
                            question.type === QuestionCategory.Positive ? skill.onTargetBehaviors :
                                question.type === QuestionCategory.Negative ? skill.potentialUnderuseBehaviors :
                                    null;

                    if (mountPoint) {
                        mountPoint.push({ description: question.description });
                    }
                }
            }

            return {
                skills: Object.values(skillsMap),
            }
    }

    protected async getSkill(clientId: number, skillId: number): Promise<IgSkillWithQuestions> {
        if (!clientId || clientId < 1) {
            throw 'Invalid clientId';
        }

        if (!skillId || skillId < 1) {
            throw 'Invalid skillId';
        }

        const skillDTO = await this.dataService.getSkillDTO({
            clientId,
            skillId,
        });

        if (!skillDTO) {
            throw 'Unable to find skill by id';
        }

        return {
            ...this.mapperService.mapSkillDTO(skillDTO),
            status: QuestionsState.Original,
            interviewQuestionLevels: {},
            potentialUnderuseBehaviorLevels: {},
            onTargetBehaviorLevels: {},
        };
    }

    protected fillSkillWithQuestions(skill: IgSkillWithQuestions, questions: IgSkillDetachedQuestion[]): void {
        const levelsMap: {
            [ questionKey: string ]: {
                questions: IgSkillQuestion[],
                levels: {
                    [ level: string ]: true
                };
            }
        } = {};

        for (const i of questions) {
            const question: IgSkillQuestion = {
                id: i.code,
                description: i.description,
                type: i.type,
                levels: [],
                status: i.status,
                dateModified: i.dateModified,
                isActive: i.isActive,
                isCustom: i.isCustom,
            };

            if (i.status === QuestionsState.Modified) {
                skill.status = QuestionsState.Modified;
            }

            const mountPoint =
                i.type === QuestionCategory.Positive ? skill.onTargetBehaviorLevels :
                    i.type === QuestionCategory.Negative ? skill.potentialUnderuseBehaviorLevels :
                        i.type === QuestionCategory.Questionnaire ? skill.interviewQuestionLevels :
                            null;

            if (mountPoint) {
                (mountPoint[i.level] = mountPoint[i.level] || []).push(question);
                const questionKey = i.code || i.description;

                const levels = levelsMap[questionKey] || (levelsMap[questionKey] = {
                    questions: [],
                    levels: {}
                });
                levels.questions.push(question);
                levels.levels[i.level] = true;
            }
        }

        for (const i of Object.values(levelsMap)) {
            const levels = Object.keys(i.levels).map(Number).sort();
            for (const question of i.questions) {
                question.levels = levels;
            }
        }
    }

    @LogErrors()
    async updateSkillQuestions(clientId: number, userId: number, skillId: number, payload: IgUpdateSkillQuestionsPayload): Promise<IgUpdateSkillResponse> {
            const operationId = await this.dataService.addSkillOperationDetails({
                clientId,
                skillId,
                isReverted: false,
            });

            const base: Partial<IgSkillStagingQuestionDTO> = {
                operationId: operationId,
                clientId: clientId,
                editorId: userId,
                skillId: skillId,
                skillCode: payload.globalCode,
                skillName: payload.name,
                skillDescription: payload.description,
            };

            const collections: { [type: string]: Record<number, IgSkillQuestion[]> } = {
                [QuestionCategory.Positive]: payload.onTargetBehaviorLevels,
                [QuestionCategory.Negative]: payload.potentialUnderuseBehaviorLevels,
                [QuestionCategory.Questionnaire]: payload.interviewQuestionLevels,
            };

            const questionBaseRefs: { [questionKey: string]:
                    {
                        allLevels: number[],
                        questionBase: Partial<IgSkillStagingQuestionDTO>,
                        perLevel: { [level: string]: { isEnabled: boolean } },
                    }
            } = {};

            for (const [type, collection] of Object.entries(collections)) {
                for (const [level, questions] of Object.entries(collection)) {
                    for (const question of questions) {
                        const questionKey = String([type, question.id || question.description || '']);
                        const ref = (questionBaseRefs[questionKey] = questionBaseRefs[questionKey] || {
                            allLevels: [],
                            questionBase: {},
                            perLevel: {},
                        });
                        ref.allLevels.push(...(question.levels || []));
                        ref.questionBase = {
                            ...base,
                            type,
                            code: question.id || null,
                            description: question.description
                        };
                        ref.perLevel[level] = {
                            isEnabled: Boolean(question.isActive)
                        };
                    }
                }
            }

            const DTOs: IgSkillStagingQuestionDTO[] = [];

            for (const ref of Object.values(questionBaseRefs)) {
                for (const level of [...new Set(ref.allLevels)]) {
                    DTOs.push({
                        ...ref.questionBase,
                        level,
                        isEnabled: ref.perLevel[level]?.isEnabled ?? false,
                    } as IgSkillStagingQuestionDTO);
                }
            }

            if (!DTOs.length) {
                throw 'No meaningful changes provided';
            }

            await this.dataService.insertStagingSkillQuestions(DTOs);
            await this.dataService.finalizeSkillQuestionsChange(operationId);

            return {
                operationId
            };
    }

    @LogErrors()
    async discardSkillCustomQuestions(clientId: number, skillId: number): Promise<IgUpdateSkillResponse> {
            const operationId = await this.dataService.addSkillOperationDetails({
                clientId,
                skillId,
                isReverted: true,
            });

            await this.dataService.finalizeSkillQuestionsChange(operationId);

            return {
                operationId
            };
    }

    protected sortIgSkillQuestions(questions: IgSkillQuestion[]): void {
        questions.sort((a, b) =>{
            if (a.id) {
                if (b.id) {
                    return compareAlphaNumericSubsets(a.id, b.id);
                } else {
                    return -1;
                }
            }
            return compareAlphaNumericSubsets(a.dateModified, b.dateModified) || compareAlphaNumericSubsets(a.description, b.description);
        });
    }

    protected sortIgSkillDetails(skill: IgSkillWithQuestions): IgSkillWithQuestions {
        for (const quesions of Object.values(skill.interviewQuestionLevels || {})) {
            this.sortIgSkillQuestions(quesions);
        }
        for (const quesions of Object.values(skill.potentialUnderuseBehaviorLevels || {})) {
            this.sortIgSkillQuestions(quesions);
        }
        for (const quesions of Object.values(skill.onTargetBehaviorLevels || {})) {
            this.sortIgSkillQuestions(quesions);
        }
        return skill;
    }
}
