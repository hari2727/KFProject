import { BadRequestException, Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger';
import axios from 'axios';

import { RequestCommon } from '../../common/common.utils';
import { RequestFactory } from '../../common/request-factory';
import {
    AssessmentRawResponse,
    AuthTokenResponse,
    ClientJobDecisionMakingSliderResponse,
    CustomProfilesRawResponse,
    DriversCultureRankings,
    InputJsonForKfiApi,
    JobAnswers,
    JsonForCalculateAssessment,
    KfiApiResponseRaw,
    RoleRequirementQA,
    SliderQuery,
    TraitsAndDriversResponse,
} from './sliders.interface';
import { SlidersRepository } from './sliders.repository';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { StopErrors } from '../../_shared/error/stop-errors.decorator';
import { Loggers } from '../../_shared/log/loggers';
import { ConfigService } from '../../_shared/config/config.service';
import { safeNumber, safeString } from '../../_shared/safety';
import { toUnique } from '../../_shared/collection/collection';

@Injectable()
export class SlidersService {
    protected logger: LoggerService;
    protected accessKey: string;
    protected kfiApiUrl: string;
    protected failedIds = [];
    protected successIds = [];

    constructor(
        protected requestCommon: RequestCommon,
        protected repository: SlidersRepository,
        protected request: RequestFactory,
        protected loggers: Loggers,
        protected configService: ConfigService,
    ) {
        this.logger = loggers.getLogger(SlidersService.name);
        this.kfiApiUrl = this.requestCommon.getKfiCmsAuthApiUrl();
        this.accessKey = this.configService.get('CMS_ACCESS_KEY');
    }

    validateCmsData(data: ClientJobDecisionMakingSliderResponse): boolean {
        const roleRequirement = data?.content?.roleRequirementQA || [];
        return roleRequirement.length && roleRequirement.every((item: RoleRequirementQA) => Number(item.sliderValue));
    }

    @LogErrors()
    async migrateCustomSPs(query: SliderQuery): Promise<void> {
            const clientIds = query.clientId.split(',');
            this.validateQueryParams(clientIds);
            this.successIds = [];
            this.failedIds = [];
            let assessmentRawResponse: AssessmentRawResponse[] = [];
            // Get custom profiles for the client
            // Generate auth token for kfi external api
            const kfiAuthToken = (await this.generateAuthToken()).token;
            // Loop through each custom profile and migrate sliders
            clientIds.forEach(async (clientId: string) => {
                console.time('GetCustomProfiles');
                const customProfileIds: CustomProfilesRawResponse[] = await this.repository.getCustomProfiles(clientId);
                this.logger.debug(`Profiles count for ${safeNumber(clientId)}: ${customProfileIds.length}`);
                console.timeEnd('GetCustomProfiles');
                console.time(`Total-time-for-all-profiles-${safeNumber(clientId)}`);
                for (const profile of customProfileIds) {
                    console.time(`Total-time-for-${safeNumber(clientId)}-${safeNumber(profile.ClientJobID)}`);
                    // get raw data from DB for kfi external api call
                    console.time(`storeproc1-call-${safeNumber(clientId)}-${safeNumber(profile.ClientJobID)}`);
                    const ucpRawResponse: KfiApiResponseRaw[] = await this.repository.getJsonForUcpOnProfileId(profile.ClientJobID);
                    console.timeEnd(`storeproc1-call-${safeNumber(clientId)}-${safeNumber(profile.ClientJobID)}`);
                    let kfiPayload = null;
                    let cmsData = null;
                    let traitsAndDriversData = null;
                    //generate payload for client job decision making slider
                    if (!ucpRawResponse?.length) {
                        this.logger.debug(`No ucp proc data found for profile: ${safeNumber(profile.ClientJobID)}`);
                    } else {
                        kfiPayload = this.generateJsonForUcpApi(ucpRawResponse);
                        console.time(`cms api call-${safeNumber(clientId)}-${safeNumber(profile.ClientJobID)}`);
                        // make ucp call
                        this.logger.debug(`kfi Payload: ${safeString(JSON.stringify(kfiPayload))}`);
                        cmsData = await this.ClientJobDecisionMakingSliderData(kfiPayload, kfiAuthToken, profile.ClientJobID);
                        this.logger.debug(`cmsData: ${safeString(JSON.stringify(cmsData))}`);
                        console.timeEnd(`cms api call-${safeNumber(clientId)}-${safeNumber(profile.ClientJobID)}`);
                    }
                    const isCmsDataValid = this.validateCmsData(cmsData);
                    if(isCmsDataValid) {
                        await this.repository.loadSlidersData(
                            clientId,
                            profile.ClientJobID,
                            cmsData.content.roleRequirementQA
                        )
                        // get raw data from Db for calculate assessment
                        console.time(`storeproc2-call-${safeNumber(clientId)}-${safeNumber(profile.ClientJobID)}`);
                        assessmentRawResponse = await this.repository.getCalculateAssessmentData(clientId, profile.ClientJobID);
                        console.timeEnd(`storeproc2-call-${safeNumber(clientId)}-${safeNumber(profile.ClientJobID)}`);
                    } else {
                        this.logger.debug(`KFI Data valid: ${Boolean(isCmsDataValid)}`);
                        this.failedIds.push(profile.ClientJobID);
                    }
                    // Generate assessment payload for calculate assessment from Web Methods Api
                    let assessmentPayload = null;
                    if (!assessmentRawResponse?.length) {
                        this.logger.debug(`No assessment proc data found for profile: ${safeNumber(profile.ClientJobID)}`);
                    } else if(isCmsDataValid) {
                        assessmentPayload = this.generateAssessmentJson(assessmentRawResponse, clientId);
                        // make web methods call
                        this.logger.debug(`WM Payload: ${safeString(JSON.stringify(assessmentPayload))}`);
                        console.time(`wm-api-call-${safeNumber(clientId)}-${safeNumber(profile.ClientJobID)}`);
                        traitsAndDriversData = await this.getTraitsAndDriversData(assessmentPayload, profile.ClientJobID);
                        this.logger.debug(`traitsAndDriversData: ${safeString(JSON.stringify(traitsAndDriversData))}`);
                        console.timeEnd(`wm-api-call-${safeNumber(clientId)}-${safeNumber(profile.ClientJobID)}`);
                    }
                    const isTraitsAndDriversDataValid = traitsAndDriversData?.sections.length;
                    if (isTraitsAndDriversDataValid && isCmsDataValid) {
                        // run all required queries
                        console.time(`total-db-time-${safeNumber(clientId)}-${safeNumber(profile.ClientJobID)}`);
                        await this.repository.loadSlidersTraitsAndDriversData(
                            clientId,
                            profile.ClientJobID,
                            traitsAndDriversData,
                        );
                        console.timeEnd(`total-db-time-${safeNumber(clientId)}-${safeNumber(profile.ClientJobID)}`);
                        this.successIds.push(profile.ClientJobID);
                    } else {
                        this.logger.debug(`CMS Data valid: ${Boolean(isCmsDataValid)}, TraitsAndDriversData sections: ${safeString(JSON.stringify(traitsAndDriversData))}, payload: ${safeString(JSON.stringify(assessmentPayload))}`);
                        this.failedIds.push(profile.ClientJobID);
                    }
                    console.timeEnd(`Total-time-for-${safeNumber(clientId)}-${safeNumber(profile.ClientJobID)}`);
                }
                console.timeEnd(`Total-time-for-all-profiles-${safeNumber(clientId)}`);
                this.logger.debug(`SuccessIds: ${safeString(JSON.stringify(this.successIds))}, FailedIds: ${safeString(JSON.stringify(toUnique(this.failedIds)))}`);
            });
    }

    protected generateAssessmentJson(data: AssessmentRawResponse[], clientId: string): JsonForCalculateAssessment {
        const [assessmentData] = data;
        return {
            driversCultureRankings: this.generateDriversCultureRankings(data.filter(item => item.CultureCode)),
            roleRequirementQA: this.generateRoleRequirementQA(data.filter(item => item.UCPCode)),
            kfLevelGlobalCode: assessmentData.kfLevelGlobalCode,
            normCountry: assessmentData.NormCountry,
            normVersion: assessmentData.NormVersion,
            kfRoleLevelId: assessmentData.KFRoleLevelID,
            jobId: assessmentData.ClientJobID,
            clientId,
        };
    }

    protected generateRoleRequirementQA(data: AssessmentRawResponse[]): RoleRequirementQA[] {
        return (data || []).map((item: AssessmentRawResponse) => ({
            ucpCode: item.UCPCode,
            sliderValue: item.SliderValue,
        }));
    }

    protected generateDriversCultureRankings(data: AssessmentRawResponse[]): DriversCultureRankings[] {
        return (data || []).map((item: AssessmentRawResponse) => ({
            cultureCode: item.CultureCode,
            value: item.CulturalValue,
        }));
    }

    protected generateJsonForUcpApi(data: KfiApiResponseRaw[]): InputJsonForKfiApi {
        const sectionsData = (data || []).filter(item => item.SliderQuestion);
        const companyCultureData = (data || []).filter(item => item.CulturalQuestion);
        const [rawResponse] = data;
        return {
            engagementAttributes: {
                managementLevel: rawResponse.ManagementLevel,
                ...(rawResponse?.Scope ? { scope: rawResponse.Scope } : { progression: rawResponse.Progression }),
                demoVersion: rawResponse.DemoVersion,
                normCountry: rawResponse.NormCountry,
                normVersion: rawResponse.NormVersion,
            },
            sections: {
                jobAnalysis: {
                    startDate: rawResponse.SliderStartDate,
                    completedDate: rawResponse.SliderCompletedDate,
                    answers: this.generateSectionsAnswers(sectionsData),
                },
                companyCulture: {
                    completedDate: rawResponse.SliderCompletedDate,
                    startDate: rawResponse.SliderStartDate,
                    answers: this.generateCompanyCultureAnswers(companyCultureData),
                },
            },
        };
    }

    protected generateSectionsAnswers(data: KfiApiResponseRaw[]): JobAnswers[] {
        return (data || []).map((item: KfiApiResponseRaw) => ({
            answersequence: +item.SliderAnswerSequence,
            block: item.SliderBlock,
            question: item.SliderQuestion,
            time: item.SliderTime,
            answer: +item.SliderAnswer,
            blocksequence: +item.Blocksequence,
        }));
    }

    protected generateCompanyCultureAnswers(data: KfiApiResponseRaw[]): JobAnswers[] {
        return (data || []).map((item: KfiApiResponseRaw) => ({
            answer: +item.CulturalAnswer,
            time: item.CulturalStartDate,
            block: item.CulturalBlock,
            answersequence: +item.CulturalAnswerSequence,
            question: item.CulturalQuestion,
        }));
    }

    @StopErrors()
    @LogErrors()
    protected async getTraitsAndDriversData(json: JsonForCalculateAssessment, jobId: number): Promise<TraitsAndDriversResponse> {
            const url = this.requestCommon.getTraitsAndDriversApiUrl();
            const headers = { 'Content-Type': 'application/json; charset=utf-8' };
            const result = await axios
                .post(url, json, { headers })
                .then(res => res)
                .catch(function (error) {
                    return null;
                });
            return result?.data?.data ? result.data.data : null;
    }

    @LogErrors()
    protected async ClientJobDecisionMakingSliderData(jsonData: any, authToken: string, jobId: number): Promise<ClientJobDecisionMakingSliderResponse> {
        const headers = {
            Authorization: authToken,
            'Content-Type': 'application/json; charset=utf-8',
        };
        const url = this.requestCommon.getKfiCmsClientJobDecisionApiUrl();
        return (await axios
            .post(url, jsonData, { headers })
            .then(res => (res?.data ? res.data : null)))
    }

    protected validateQueryParams(clientIds: string[]) {
        if (!clientIds.length) {
            throw new BadRequestException('Invalid client id');
        }
        const validClients = clientIds.every(clientId => /^[0-9]+$/.test(clientId));
        if (!validClients) {
            throw new BadRequestException('Invalid client ids');
        }
    }

    @LogErrors()
    protected async generateAuthToken(): Promise<AuthTokenResponse> {
            const result = await axios.post(
                this.requestCommon.getKfiCmsAuthApiUrl(),
                {
                    accessKey: this.accessKey,
                },
                null,
            );
            return result?.data;
    }
}
