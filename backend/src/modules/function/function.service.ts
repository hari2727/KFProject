import { Injectable } from '@nestjs/common';
import { checkSpecialCharacter, escapeSingleQuote, okResponse, validateQueryParams } from '../../common/common.utils';
import { AppCode as ec } from '../../app.const';
import {
    AddJobFamilyResponse,
    FamiliesOnTypeResponseData,
    FAMILY_TYPE,
    FamilyStatusBody,
    FamilySubFamilyModel,
    FunctionsSubfunctionsPayload,
    FunctionsSubfunctionsPayloadObj,
    GetJobFamilyQuery,
    GetJobFamilyResponse,
    JobClientIndustryDbValues,
    JobFamily,
    JobFamilyResponse,
    JobFamilySubFamilyParams,
    JobIndustryResponse,
    JobModelDbResponse,
    JobModelDetailsData,
    JobModelDetailsQueryProps,
    JobModelDetailsResponse,
    JobModelIndustry,
    JobModelQueryProps,
    JobModelResponse,
    LanguageFunction,
    LanguageFunctions,
    ParamsObj,
    ProfileStasApiResponse,
    ProfileStats,
    ProfileStatsQuery,
    ProfileStatsResponse,
    SubFamilesValidation,
    SubFamilies,
    UpdateFamilyStatusQuery,
} from './function.interface';
import { FunctionRepository } from './function.repository';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { AppError } from '../../_shared/error/app-error';

@Injectable()
export class FunctionService {
    constructor(protected functionRepository: FunctionRepository) {}

    @LogErrors()
    async publishFunction(clientId: number): Promise<any> {
            console.time('publishFunction');
            await this.functionRepository.transferJobFamilyAndSubFamily(clientId);
            console.timeEnd('publishFunction');
            return okResponse;
    }

    @LogErrors()
    async updateFamilyStatus(query: UpdateFamilyStatusQuery, body: FamilyStatusBody): Promise<any> {
            const bodyProperties = Object.keys(body);
            if (bodyProperties.length === 1 && FAMILY_TYPE.hasOwnProperty(bodyProperties.toString())) {
                return await this.functionRepository.updateFamilyStatus(query, bodyProperties.toString(), body);
            } else {
                throw 'Invalid body payload provided.';
            }
    }

    @LogErrors()
    async getProfileStats(query: ProfileStatsQuery): Promise<ProfileStasApiResponse> {
            console.time('getProfileStats');
            const profileStatsDBResponse: ProfileStats[] = await this.functionRepository.getProfileStats(query);
            console.timeEnd('getProfileStats');
            return { profileStats: this.mapProfileStatusResponse(profileStatsDBResponse) };
    }

    @LogErrors()
    async getJobModels(query: JobModelQueryProps): Promise<JobModelResponse> {
            console.time('getJobModels');
            const jobModelDbResponse: JobModelDbResponse[] = await this.functionRepository.getJobModels(query);
            console.timeEnd('getJobModels');
            return this.mapJobModelsResponse(jobModelDbResponse, query.preferredClientId);
    }

    @LogErrors()
    async getIndustryJobModels(query: JobModelDetailsQueryProps, modelId: string): Promise<JobIndustryResponse> {
            console.time('getIndustryJobModels');
            const jobIndustryModelDbResponse: JobClientIndustryDbValues[] = await this.functionRepository.getIndustryJobModels(query, modelId);
            const jobModelDetailStatus = await this.functionRepository.getJobModelIndustryDetailsStatus(query);
            console.timeEnd('getIndustryJobModels');
            return {
                status: jobModelDetailStatus.status,
                industry: this.generateIndustryJobModelsResponse(jobIndustryModelDbResponse),
            };
    }

    protected generateIndustryJobModelsResponse(data: JobClientIndustryDbValues[]): JobModelIndustry[] {
        let industryList: JobModelIndustry[] = [];
        data.forEach((industry: JobClientIndustryDbValues) => {
            if (industry.ClientIndustryID) {
                const findIndustry = (industryList || []).find((industryModel: JobModelIndustry) => industryModel.id === industry.ClientIndustryID);
                if (!findIndustry) {
                    industryList = [
                        ...industryList,
                        {
                            id: industry.ClientIndustryID,
                            name: industry.ClientIndustryTitle,
                            jobFamilies: this.getJobFamiliesList(data.filter(familyModel => familyModel.ClientIndustryID === industry.ClientIndustryID)),
                        },
                    ];
                }
            }
        });
        return industryList;
    }

    protected mapJobModelsResponse(jobModels: JobModelDbResponse[], clientId: string): JobModelResponse {
        const models = [];
        jobModels.forEach((data: JobModelDbResponse) => {
            const modelObject = {
                id: data.modelId,
                version: data.modelVersion,
                clientId: clientId,
                type: null,
                parentType: null,
                name: data.modelName,
                description: data.modelDescription,
                isActive: data.isActive === 1,
                isCustom: data.isCustom === 1,
                outputType: data.outputType,
                locales: [
                    {
                        locale: data.locale,
                        localeName: data.localName || null,
                        isMaster: data.isMaster === 1,
                    },
                ],
            };
            models.push(modelObject);
        });
        return { models };
    }

    mapProfileStatusResponse(profileStats: ProfileStats[]): ProfileStatsResponse[] {
        return profileStats.map((stat: ProfileStats) => {
            return {
                profileType: stat.ProfileType,
                createdBy: stat.CreatedBy,
                count: stat.ProfileCreatedByCnt,
            };
        });
    }

    @LogErrors()
    async addJobFamily(query: UpdateFamilyStatusQuery, body: JobFamily): Promise<JobFamilyResponse> {
            console.time('addJobFamily');
            const dbResponse: AddJobFamilyResponse[] = await this.functionRepository.addJobFamily(query, body);
            console.timeEnd('addJobFamily');
            return this.mapAddJobResponseData(dbResponse);
    }

    @LogErrors()
    async getJobFamilies(query: GetJobFamilyQuery): Promise<FamiliesOnTypeResponseData[]> {
            console.time('getJobFamilies');
            const dbResponse: GetJobFamilyResponse[] = await this.functionRepository.getJobFamilies(query);
            console.timeEnd('getJobFamilies');
            return this.mapGetDbResponseData(dbResponse);
    }

    mapGetDbResponseData(dbData: GetJobFamilyResponse[]): FamiliesOnTypeResponseData[] {
        let families: FamiliesOnTypeResponseData[] = [];
        dbData.forEach((familyModel: GetJobFamilyResponse) => {
            const subFamiliesFilter = dbData.filter((row: GetJobFamilyResponse) => row.JobFamilyID === familyModel.JobFamilyID);
            const duplicateFamily = families.find((family: FamiliesOnTypeResponseData) => family.id === familyModel.JobFamilyID);
            if (!duplicateFamily) {
                families.push({
                    id: familyModel.JobFamilyID,
                    name: familyModel.JobFamilyName,
                    description: familyModel.JobFamilyDescription,
                    ...(subFamiliesFilter.length ? { subFamilies: this.listSubFamilies(subFamiliesFilter) } : {}),
                });
            }
        });
        return families;
    }

    listSubFamilies(subFamilesList: GetJobFamilyResponse[]): SubFamilies[] {
        const subFamiles: SubFamilies[] = [];
        subFamilesList.forEach((subFamilyDB: GetJobFamilyResponse) => {
            const jobTypeFilter = subFamilesList.filter(subFamily => subFamily.JobSubFamilyID === subFamilyDB.JobSubFamilyID && subFamilyDB.JobRoleTypeID);
            const duplicateSubFamily = subFamiles.find(subFamily => subFamily.id === subFamilyDB.JobSubFamilyID);
            if (!duplicateSubFamily) {
                subFamiles.push({
                    id: subFamilyDB.JobSubFamilyID,
                    name: subFamilyDB.JobSubFamilyName,
                    description: subFamilyDB.JobSubFamilyDescription,
                    ...(jobTypeFilter.length
                        ? {
                              jobTypes: jobTypeFilter.map(job => ({
                                  id: job.JobRoleTypeID,
                                  name: job.JobRoleTypeName,
                                  description: job.JobRoleTypeDescription,
                              })),
                          }
                        : {}),
                });
            }
        });
        return subFamiles;
    }

    mapAddJobResponseData(dbData: AddJobFamilyResponse[]): JobFamilyResponse {
        let jobFamilyResponse: JobFamilyResponse = null;
        dbData.forEach(data => {
            jobFamilyResponse = {
                family: {
                    id: data.JobFamilyID,
                    name: data.JobFamilyName,
                    description: data.JobFamilyDescription,
                    isCustom: data.IsCustom === 1 ? true : false,
                    isActive: true,
                    kfJobFamilyId: data.ParentFamilyID,
                },
            };
        });
        return jobFamilyResponse;
    }

    @LogErrors()
    async updatefamilysubfamily(query: UpdateFamilyStatusQuery, body: FunctionsSubfunctionsPayloadObj): Promise<{ families: FunctionsSubfunctionsPayload[] }> {
        if (!body?.families?.length) {
            throw new AppError(ec.ERROR_MESSAGE, 500, { errorCode: ec.FAMILY_EMPTY });
        }

        const haveSpecialChars = body.families.some(family =>
            checkSpecialCharacter(family.name) ||
            (family.subFamilies || []).some(subFamily => checkSpecialCharacter(subFamily.name)),
        );
        if (haveSpecialChars) {
            throw new AppError(ec.ERROR_MESSAGE, 400, { errorCode: ec.SPECIAL_CHARACTER_RESPONSE });
        }

        const familydata = await this.functionRepository.getJobFamilyNameValidation(query, body); //true
        if (familydata.length) {
            throw new AppError(ec.ERROR_MESSAGE, 400, { errorCode: ec.FAMILY_DUPLICATE });
        }

        const family = body.families[0];
        const subFamilies = family?.subFamilies;

        if (subFamilies && subFamilies.length) {
            const subFamilyData = await this.functionRepository.getJobSubFamilyValidation(query, family, subFamilies);
            if (subFamilyData.length) {
                throw new AppError(ec.ERROR_MESSAGE, 400, { errorCode: ec.SUBFAMILY_DUPLICATE });
            }
        }

        if (family) {
            let index = 0;
            if (subFamilies && subFamilies.length) {
                for (const subFamily of subFamilies) {
                    await this.functionRepository.modificationJobFamilySubFamily(query, family, subFamily, index++);
                }
            } else {
                await this.functionRepository.modificationJobFamilySubFamily(query, family, null, index++);
            }
        }

        const data = await this.functionRepository.updatefamilysubfamily(query, body);

        return {
            families: this.getJobFamiliesList(data),
        };
    }

    @LogErrors()
    async addLanguageFunction(query: UpdateFamilyStatusQuery, body: LanguageFunctions): Promise<any> {
            console.time('add-language-function');
            const isInValid = validateQueryParams(query);
            if (isInValid) {
                throw 'Invalid body query parameters provided.';
            }
            if (body?.families?.length) {
                const { families } = body;
                const [parentResponse] = await this.functionRepository.addParentLanguageFunction(families, query);
                const familyId = parentResponse.JobFamilyID;
                for (let family of families || []) {
                    family.id = familyId;
                    await this.addFunctionToStagingTable(family, query);
                }
                await this.functionRepository.updateFunctionsSubFunctions(query);
                console.timeEnd('add-language-function');
                return okResponse;
            } else {
                throw new AppError(ec.ERROR_MESSAGE, 400, { errorCode: ec.FAMILY_EMPTY});
            }
    }

    @LogErrors()
    protected async addFunctionToStagingTable(family: LanguageFunction, query: UpdateFamilyStatusQuery): Promise<void> {
        let index = 0;
        const subFamilies = family?.subFamilies || [];
        if (subFamilies && subFamilies.length) {
            for (const subFamily of subFamilies) {
                await this.functionRepository.insertFunctionSubFunction(family, subFamily, query, index++);
            }
        } else {
            await this.functionRepository.insertFunctionSubFunction(family, null, query, index++);
        }
    }

    protected generateJobFamilySubFamilyProps(
        query: UpdateFamilyStatusQuery,
        baseFamily: FunctionsSubfunctionsPayload,
        subFamily: FunctionsSubfunctionsPayload,
        index = 0,
    ): JobFamilySubFamilyParams {
        return {
            ItemType: null,
            FamilySubFamilyModelGUID: query.modelId,
            JobFamilyID: baseFamily.id,
            JobFamilyName: escapeSingleQuote(baseFamily.name) ?? null,
            JobFamilyIsCustom: +baseFamily.isCustom || 0,
            JobSubFamilyID: subFamily?.id || null,
            JobSubFamilyName: escapeSingleQuote(subFamily?.name) ?? null,
            JobSubFamilyDescription: escapeSingleQuote(subFamily?.description) ?? null,
            JobSubFamilyIsCustom: +subFamily?.isCustom || 0,
            JobSubFamilyDisplayFlagID: null,
            KFFamilyID: baseFamily.id,
            ParentSubFamilyID: baseFamily.id ?? null,
            JobSubFamilyOrder: index,
            CreatedBy: query.userId,
            ModificationComplete: 0,
            LCID: query.preferredLocale,
            JobFamilyDescription: escapeSingleQuote(baseFamily.description) ?? null,
        } as JobFamilySubFamilyParams;
    }

    @LogErrors()
    async getJobModelDetails(query: JobModelDetailsQueryProps, modelId: string): Promise<JobModelDetailsResponse> {
            console.time('getJobModelDetails');
            const jobModelDetailsDbResponse: FamilySubFamilyModel[] = await this.functionRepository.getJobModelDetails(query, modelId);
            const jobModelDetailStatus = await this.functionRepository.getJobModelDetailsStatus(query);
            console.timeEnd('getJobModelDetails');
            return {
                status: jobModelDetailStatus.status,
                jobFamilies: this.getJobFamiliesList(jobModelDetailsDbResponse),
            };
    }

    protected getJobFamiliesList(jobFamilies: FamilySubFamilyModel[]): JobModelDetailsData[] {
        let jobFamiliesList: JobModelDetailsData[] = [];
        jobFamilies.forEach((jobFamilyModel: JobClientIndustryDbValues) => {
            if (jobFamilyModel.JobFamilyID) {
                const findFamily = (jobFamiliesList || []).find((jobFamily: JobModelDetailsData) => jobFamily.id === jobFamilyModel.JobFamilyID);
                if (!findFamily) {
                    const subFamiliesFilter = (jobFamilies || []).filter(
                        subFamilyModel => subFamilyModel.JobFamilyID === jobFamilyModel.JobFamilyID && subFamilyModel?.JobSubFamilyID,
                    );
                    jobFamiliesList = [
                        ...jobFamiliesList,
                        {
                            id: jobFamilyModel.JobFamilyID,
                            name: jobFamilyModel.JobFamilyName,
                            isCustom: jobFamilyModel.CustomJobFamily === 1,
                            isActive: jobFamilyModel.JobFamilyIsActive ? true : false,
                            jobsCount: jobFamilyModel.JobFamilyCount,
                            originalName: jobFamilyModel.JobFamilyOriginalName,
                            kfJobFamilyId: jobFamilyModel.ParentFamilyID,
                            description: jobFamilyModel.JobFamilyDescription,
                            originalDescription: jobFamilyModel.JobFamilyOriginalDescription,
                            ...(subFamiliesFilter.length
                                ? {
                                      subFamilies: subFamiliesFilter.map((model: JobClientIndustryDbValues) => ({
                                          id: model.JobSubFamilyID,
                                          name: model.JobSubFamilyName,
                                          description: model.JobSubFamilyDescription,
                                          isCustom: Number(model.CustomJobSubFamily) === 1,
                                          isActive: Boolean(model.JobSubFamilyIsActive),
                                          jobsCount: model.JobSubFamilyCount,
                                          originalName: model.JobSubFamilyOriginalName,
                                          kfJobSubFamilyId: model.ParentSubFamilyID,
                                          jobCategoryId: model?.JobCategoryID || null,
                                          originalDescription: model.JobSubFamilyOriginalDescription,
                                      })),
                                  }
                                : {}),
                        },
                    ];
                }
            }
        });
        return jobFamiliesList;
    }
}
