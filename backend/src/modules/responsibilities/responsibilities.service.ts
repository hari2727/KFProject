import { Injectable } from '@nestjs/common';
import { isBoolean } from 'class-validator';
import { Locale } from '../../common/common.const';
import { QueryProps } from '../../common/common.interface';
import { okResponse } from '../../common/common.utils';
import { AppCode as ec } from '../../app.const';
import {
    AddNewSubcategories,
    DescriptionDBResponse,
    Descriptions,
    DescriptionsBody,
    DescriptionsMappedResponse,
    DescriptionsResponse,
    DescriptionTypes,
    GetDependentsSubCategory,
    GetDependentSubCategory,
    GetDependentSubCategoryDBResponse,
    GetDetailDescription,
    GetResponsibilityDetailIdDBResponse,
    GetResponsibilityDetailIdResponse,
    GetResponsibilityModelQuery,
    GetSubCategoryDetail,
    GetSuccessProfileDescriptionsDBResponse,
    GetSuccessProfileDescriptionsResponse,
    GetUserLocaleDBResponse,
    ModelData,
    ModelDataResponse,
    ModelDBResponse,
    ModelQuery,
    NewModelAPIResponse,
    NewModelCategories,
    NewModelDBResponse,
    NewModelResponse,
    NewModelSubCategories,
    OldModelAPICategories,
    OldModelAPIResponse,
    OldModelDBResponse,
    QueryUpdateCountValue,
    ResponsibilitiesStatusUpdateBody,
    ResponsibilitiesStatusUpdateResponse,
    ResponsibilityDescriptionQuery,
    SearchCategoriesRawDBResponse,
    SearchCategory,
    SearchCategoryDescriptions,
    SearchCategoryResponse,
    SearchCategorySubCategories,
    SubCategory,
    SubcategoryType,
    UpdateResponsibilityBody,
    UpdateResponsibilityQuery,
} from './responsibilities.interface';
import { ResponsibilitiesRepository } from './responsibilities.repository';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { MapErrors } from '../../_shared/error/map-errors.decorator';
import { toBit, toBoolean, toLocale, toNumber } from '../../_shared/convert';
import { safeString } from '../../_shared/safety';

@Injectable()
export class ResponsibilitiesService {

    constructor(
        protected responsibiltiesRepository: ResponsibilitiesRepository
    ) {}

    @LogErrors()
    async getOldModelResponsibilities(query: ModelQuery, modelId: string): Promise<OldModelAPIResponse> {
            this.validateQueryParams(query);
            const responsibilitiesDBResponse: OldModelDBResponse[] = await this.responsibiltiesRepository.getOldModelResponsibilities(query, modelId);
            const [status] = await this.responsibiltiesRepository.getResponsibilitiesStatus(query);
            const categories: OldModelAPICategories[] = this.mapOldModelsResponse(responsibilitiesDBResponse);
            return {
                models: {
                    categories,
                },
                status: status.Modification,
            };
    }

    @LogErrors()
    async getNewModelResponsibilities(query: ModelQuery, modelId: string): Promise<NewModelAPIResponse> {
            this.validateQueryParams(query);
            const responsibilitiesDBResponse: NewModelDBResponse[] = await this.responsibiltiesRepository.getNewModelResponsibilities(query, modelId);
            const [status] = await this.responsibiltiesRepository.getResponsibilitiesStatus(query);
            if (responsibilitiesDBResponse.length) {
                return {
                    models: this.mapNewModelsResponse(responsibilitiesDBResponse, query),
                    status: status.Modification,
                };
            }
            throw 'No data found for the given query params for getNewModelResponsibilities.';
    }

    @LogErrors()
    async getModelResponsibilities(query: GetResponsibilityModelQuery): Promise<ModelDataResponse> {
            this.validateQueryParams(query);
            const responsibilitiesModelDBResponse: ModelDBResponse[] = await this.responsibiltiesRepository.getResponsibilitiesModels(query);
            const modelsresp: ModelData[] = this.mapModelsResponse(responsibilitiesModelDBResponse, SubcategoryType.RESPONSIBILITY);
            return {
                models: modelsresp,
            };
    }

    @LogErrors()
    async responsibilitiesPublish(query: QueryProps.Default, jobSectionCode: SubcategoryType): Promise<any> {
        await this.responsibiltiesRepository.responsibilitiesPublish(query.loggedInUserClientId, jobSectionCode);
        return okResponse;
    }

    @MapErrors({ errorCode: ec.EXTERNAL_CALL_ERR })
    @LogErrors()
    async getResponsibilityModelDetailId(query: GetResponsibilityModelQuery, id: number): Promise<GetResponsibilityDetailIdResponse> {
            this.validateQueryParams(query);
            const getResponsibilityDetailDBResp: GetResponsibilityDetailIdDBResponse[] = await this.responsibiltiesRepository.getResponsibilityModelDetailId(
                query,
                id,
            );
            if (getResponsibilityDetailDBResp.length) {
                return this.mapGetRespDetDBRespToGetRespDet(getResponsibilityDetailDBResp);
            } else {
                throw new Error('No Responsibility Response found for given detail id.');
            }
    }

    public mapOldModelsResponse(data: OldModelDBResponse[]): OldModelAPICategories[] {
        return data.map((row: OldModelDBResponse) => ({
            id: row.JobCategoryID,
            name: row.JobCategoryName.trim(),
            description: row.JobCategoryDescription.trim(),
        }));
    }

    public mapModelsResponse(data: ModelDBResponse[], outputType: SubcategoryType): ModelData[] {
        return data.map((row: ModelDBResponse) => ({
            id: row.CompetencyModelGUID,
            version: row.CompetencyModelVersion,
            clientId: row.ClientID,
            type: row.CompetencyModelTemplateName,
            parentType: row.CompetencyModelParentType,
            name: row.CompetencyModelName,
            description: row.CompetencyModelDescription.trim(),
            isActive: row.IsActive === 1,
            isCustom: row.IsCustomCompetencyModel === 1,
            outputType,
            locales: [
                {
                    locale: row.LCID,
                    localeName: row.LocaleName,
                    isMaster: row.MasterCompetencyModel === 1,
                },
            ],
        }));
    }

    protected mapNewModelsResponse(data: NewModelDBResponse[], query: ModelQuery): NewModelResponse {
        return {
            id: data[0].CompetencyModelGUID,
            version: data[0].CompetencyModelVersion,
            clientId: Number(query.preferredClientId),
            type: data[0].CompetencyModelTemplateName,
            parentType: data[0].CompetencyModelParentType,
            name: data[0].CompetencyModelName,
            description: data[0].CompetencyModelDescription.trim(),
            isActive: Boolean(data[0].IsActive),
            isCustom: Boolean(data[0].IsCustomCompetencyModel),
            locale: query.preferredLocale,
            categories: this.generateNewModelCategories(data),
        };
    }

    protected generateNewModelCategories(data: NewModelDBResponse[]): NewModelCategories[] {
        let categories: NewModelCategories[] = [];
        data.forEach(model => {
            const categoryExists = categories.find(category => category.id === model.JobCategoryID);
            if (!categoryExists) {
                categories.push({
                    id: model.JobCategoryID,
                    name: model.JobCategoryName,
                    description: model.JobCategoryDescription.trim(),
                    isCategoryEnabled: model.IsCategoryEnabled.toString(),
                    subCategories: this.generateNewModelSubCategories(data.filter(category => category.JobCategoryID === model.JobCategoryID)),
                });
            }
        });
        return categories;
    }

    protected generateNewModelSubCategories(data: NewModelDBResponse[]): NewModelSubCategories[] {
        // Group by JobSubCategoryID first
        const uniqueSubCategories = Array.from(new Map(data.map(item => [item.JobSubCategoryID, item])).values());

        return uniqueSubCategories.map(model => {
            const dependents: GetDependentsSubCategory[] = this.generateNewModelDependents(
                data.filter(subCategory => subCategory.JobSubCategoryID === model.JobSubCategoryID),
            );
            return {
                id: model.JobSubCategoryID,
                name: model.JobSubCategoryName?.trim(),
                order: model.JobSubCategoryOrder,
                isCustom: Boolean(model.IsCustomJobSubCategory),
                isActive: Boolean(model.DisplayJobSubCategory),
                definition: model.JobSubCategoryDescription?.trim(),
                skillsCount: model.SkillsCount,
                ...(dependents.length ? { dependents } : {}),
            };
        });
    }

    protected generateNewModelDependents(data: NewModelDBResponse[]): GetDependentsSubCategory[] {
         // If no data or JobSubCategoryDependantID is null, return empty array
         if (!data?.length || !data[0].JobSubCategoryDependantID) {
            return [];
        }

        return data.map(model => ({
            id: Number(model.JobSubCategoryDependantID),
            name: model.JobSubCategoryDependantName,
            isCore: model.CoreSupportFlag === true || model.CoreSupportFlag === "true",
        }));
    }

    protected mapGetRespDetDBRespToGetRespDet(getResponsibilityDetailDBResp: GetResponsibilityDetailIdDBResponse[]): GetResponsibilityDetailIdResponse {
        /**
         * Get Distinct sub categories
         */
        const [getRespDetailDBResp] = getResponsibilityDetailDBResp.filter(
            (a, i) => getResponsibilityDetailDBResp.findIndex(s => a.JobSubCategoryId === s.JobSubCategoryId) === i,
        );
        const getSubCategoryDetails: GetSubCategoryDetail[] = this.mapSubCategoryDetDBRespToGetSubCategoryDetResp(
            getRespDetailDBResp,
            getResponsibilityDetailDBResp,
        );
        const getJobDetailIdResp: GetResponsibilityDetailIdResponse = {
            subCategories: getSubCategoryDetails,
        };

        return getJobDetailIdResp;
    }

    protected mapSubCategoryDetDBRespToGetSubCategoryDetResp(
        getRespDetailDBResp: GetResponsibilityDetailIdDBResponse,
        getResponsibilityDetailDBResp: GetResponsibilityDetailIdDBResponse[],
    ): GetSubCategoryDetail[] {
        const getSubCategoryDetails: GetSubCategoryDetail[] = [];
        const getJobLevelDetailDescriptions: GetDetailDescription[] = getResponsibilityDetailDBResp.length
            ? this.mapJobLevelDBDescToJobLevelDesc(getRespDetailDBResp, getResponsibilityDetailDBResp)
            : [];
        const getSubCategoryDet: GetSubCategoryDetail = {
            id: getRespDetailDBResp.JobSubCategoryId,
            name: getRespDetailDBResp.JobSubCategoryName,
            isActive: getRespDetailDBResp.JobSubCategoryIsActive == 1,
            isCustom: getRespDetailDBResp.IsCustomJobSubCategory == 1,
            definition: getRespDetailDBResp.JobSubCategoryDescription,
            originalDefinition: getRespDetailDBResp.JobSubCategoryOriginalDescription,
            originalName: getRespDetailDBResp.JobSubCategoryOriginalName,
            descriptions: getJobLevelDetailDescriptions,
        };
        getSubCategoryDetails.push(getSubCategoryDet);
        return getSubCategoryDetails;
    }

    protected mapJobLevelDBDescToJobLevelDesc(
        getJobDetailDBResponse: GetResponsibilityDetailIdDBResponse,
        getResponsibilityDetailDBResp: GetResponsibilityDetailIdDBResponse[],
    ): GetDetailDescription[] {
        const descriptions: GetDetailDescription[] = [];
        getResponsibilityDetailDBResp
            .filter(desc => desc.JobSubCategoryId === getJobDetailDBResponse.JobSubCategoryId)
            .forEach(desc => {
                const description: GetDetailDescription = {
                    id: desc.JobLevelDetailID,
                    level: desc.JobLevelID,
                    description: desc.JobLevelDetailDescription.trim(),
                    originalDescription: desc.OriginalJobLevelDescription,
                    isCustom: desc.IsCustomLevel === 1,
                };
                descriptions.push(description);
            });
        return descriptions;
    }

    protected validateQueryParams(query: any): void {
        Object.keys(query).forEach(key => {
            let isInValid = false;
            switch (key) {
                case 'preferredClientId':
                    isInValid = !/^[1-9]\d*$/.test(query.preferredClientId);
                    break;
                case 'preferredLocale':
                    isInValid = !/^[a-z]{2}(-[a-z]{2})?$/i.test(query.preferredLocale);
                    break;
                case 'outputType':
                    isInValid = !query?.outputType;
                    break;
                case 'modelVersion':
                    isInValid = !query?.modelVersion;
                    break;
                case 'subCategoryIds':
                    isInValid = query.subCategoryIds.split('|').some(i => !/^[0-9]\d*$/.test(i));
                    break;
                default:
                    break;
            }
            if (isInValid) {
                throw new Error('Please provide valid query Params');
            }
        });
    }

    @LogErrors()
    async addNewSubcategories(query: AddNewSubcategories.Query, body: AddNewSubcategories.Body, type:SubcategoryType): Promise<any> {
            this.validateQueryParams(query);

            if (!body.categories?.length) {
                throw new Error('Categories data is missing');
            }

            const parentLocale = query.preferredLocale;

            //create modification item in staging
            const [itemModificationResponse] = await this.responsibiltiesRepository.itemModificationSubCategory(type, query, new Date().toISOString()); // 1st query;
            const itemModificationId = itemModificationResponse.ItemID;
            const subFamilyId = body.subFamilyId ?? null;
            const subQueries: string[] = [];
            const params = {};

            for (const category of body.categories || []) {
                for (const multiLangSubCategory of category.subCategories || []) {
                    const parentSubCategory = multiLangSubCategory[parentLocale];
                    if (!parentSubCategory) {
                        throw new Error('Subcategory Parent locale data is missing');
                    }

                    //add subcategory in parent lang
                    const [parentJobSubCategoryResponse] = await this.responsibiltiesRepository.addJobSubCategory({
                        jobCategoryID: category.id,
                        jobSubCategoryName: parentSubCategory.name,
                        userID: query.userId,
                        clientId: query.preferredClientId,
                        jobSectionCode: type,
                        jobSubFamilyID: subFamilyId,
                        jobSubCategoryDescription: parentSubCategory.description,
                        lcid: parentLocale,
                    });

                    for (let i = 0; i < (parentSubCategory.levels || []).length; i++) {
                        const parentLevel = parentSubCategory.levels[i];
                        //add level in parent lang
                        const [jobLevelDetailsResponse] = await this.responsibiltiesRepository.addJobLevelDetail({
                            jobCategoryID: parentJobSubCategoryResponse.JobCategoryID,
                            jobLevelDetailOrder: parentLevel.level,
                            jobSubCategoryID: parentJobSubCategoryResponse.JobSubCategoryID,
                            jobLevelDetailDescription: parentLevel.description,
                            lcid: parentLocale,
                            userId: query.userId,
                        });

                        for (const locale in multiLangSubCategory) {
                            const localizedSubCategory = multiLangSubCategory[locale];
                            if (!localizedSubCategory) {
                                throw new Error('Subcategory locale data is missing');
                            }
                            const localizedLevel = localizedSubCategory.levels[i];
                            if (!localizedLevel) {
                                throw new Error('Level locale data is missing');
                            }

                            const uniqueSuffix = `${i}${locale.replace('-', '')}`
                            const localParams = {
                                [`ItemModificationID${uniqueSuffix}`]: toNumber(itemModificationId),
                                [`JobCategoryID${uniqueSuffix}`]: toNumber(parentJobSubCategoryResponse.JobCategoryID),
                                [`JobSubCategoryID${uniqueSuffix}`]: toNumber(parentJobSubCategoryResponse.JobSubCategoryID),
                                [`JobSubCategoryName${uniqueSuffix}`]: localizedSubCategory.name,
                                [`JobLevelDetailDescription${uniqueSuffix}`]: localizedLevel.description,
                                [`JobLevelDetailID${uniqueSuffix}`]: toNumber(jobLevelDetailsResponse.JobLevelDetailID),
                                [`JobLevelDetailOrder${uniqueSuffix}`]: toNumber(localizedLevel.level),
                                [`JobSubfamilyId${uniqueSuffix}`]: subFamilyId,
                                [`JobSubCategoryDescription${uniqueSuffix}`]: localizedSubCategory.description,
                                [`isCustomLevel${uniqueSuffix}`]: toBit(localizedLevel.isCustom),
                                [`LCID${uniqueSuffix}`]: toLocale(locale),
                            };

                            subQueries.push(
                                `(${Object.keys(localParams)
                                    .map(k => `:${k}`)
                                    .join(', ')})`,
                            );
                            Object.assign(params, localParams);
                        }
                    }
                }
            }
            if (!subQueries.length) {
                throw new Error('No data for insertItemModificationSubCategoryDetails query');
            }
            //add data to modification tracking table
            await this.responsibiltiesRepository.itemModificationSubCategoryDetails(subQueries, params); // 4th insert query

            //update translations tables
            await this.responsibiltiesRepository.updateSubCategory(itemModificationId); //5th query

            return okResponse;
    }

    @LogErrors()
    async updateResponsibilities(query: UpdateResponsibilityQuery, body: UpdateResponsibilityBody, type:SubcategoryType): Promise<any> {
            this.validateQueryParams(query);

            if (!body.categories?.length) {
                throw new Error('Categories data is missing');
            }
            //  const subFamilyId = body.subFamilyId ?? null;

            const [itemModificationResponse] = await this.responsibiltiesRepository.itemModificationSubCategory(type, query, new Date().toISOString()); // 1st query;
            const itemModificationId = itemModificationResponse.ItemID;

            const subQueries: string[] = [];
            const params = {};
            let JobCategoryID = 0;

            let globalIndex = 0;
            let categoryIndex = 0;
            let subCategoryIndex = 0;
            let descriptionIndex = 0;

            const mockDescription = {
                id: null,
                description: null,
                isCustom: null,
            } as unknown as DescriptionsBody;

            for (const category of body.categories || []) {
                const subFamilyId = category.subFamilyId ?? null;
                const categoryId = Number(category.newCategoryId) || category.id;
                for (const subCategory of category.subCategories || []) {
                    for (const description of subCategory.descriptions || [mockDescription]) {
                        const localParams = {
                            [`ItemModificationID${globalIndex}`]: toNumber(itemModificationId),
                            [`JobCategoryID${categoryIndex}`]: toNumber(category.id),
                            [`JobCategoryID${categoryIndex}`]: toNumber(categoryId),
                            [`JobSubCategoryID${subCategoryIndex}`]: toNumber(subCategory.id),
                            [`JobSubCategoryName${subCategoryIndex}`]: subCategory.name,
                            [`JobLevelDetailDescription${descriptionIndex}`]: description.description,
                            [`JobLevelDetailID${descriptionIndex}`]: toNumber(description.id),
                            [`JobLevelDetailOrder${globalIndex}`]: null, // Ignored during updates, should be nullish
                            [`JobSubfamilyId${globalIndex}`]: subFamilyId,
                            [`JobSubCategoryDescription${subCategoryIndex}`]: subCategory.definition,
                            [`isCustomLevel${descriptionIndex}`]: toBit(description.isCustom),
                            [`isCustomLevel${descriptionIndex}`]: description.isCustom === null ? null : toBit(description.isCustom),
                            [`LCID${globalIndex}`]: toLocale(query.preferredLocale),
                        };
                        subQueries.push(
                            `(${Object.keys(localParams)
                                .map(k => `:${k}`)
                                .join(', ')})`,
                        );
                        Object.assign(params, localParams);

                        descriptionIndex++;
                    }
                    subCategoryIndex++;
                }
                categoryIndex++;
            }

            if (!subQueries.length) {
                throw new Error('No data for insertItemModificationSubCategoryDetails query');
            }
            await this.responsibiltiesRepository.itemModificationSubCategoryDetails(subQueries, params); // 4th insert query
            await this.responsibiltiesRepository.updateSubCategory(itemModificationId);
            for (const category of body.categories || []) {
                for (const subCategory of category.subCategories || []) {
                    JobCategoryID = subCategory.id;
                    if (this.isCustomFalseOrUndefined(subCategory.isCustom)) {
                        await this.responsibiltiesRepository.JobSubCategory(subCategory.id);
                    }
                }
            }

            return okResponse;
    }

    protected mapDbDataforDescription(descriptiondata: DescriptionDBResponse[]): DescriptionsResponse {
        const descriptionsMappedResponse: DescriptionsMappedResponse[] = descriptiondata.map((description: DescriptionDBResponse) => ({
            name: description.JobSubCategoryName.trim(),
            level: description.JobLevel,
            levelLabel: description.JobLevelLabel,
            description: description.JobLevelDescription.trim(),
            isCustom: true,
        }));
        return { descriptions: descriptionsMappedResponse };
    }

    @LogErrors()
    async responsibilityDescriptions(
        query: ResponsibilityDescriptionQuery,
    ): Promise<DescriptionsResponse | GetSuccessProfileDescriptionsResponse | SearchCategoryResponse> {
            this.removeEmptyParams(query);
            this.validateQueryParams(query);

            if (!query.subCategoryIds) {
                if (!query.type || !Object.keys(DescriptionTypes).includes(query.type)) {
                    throw new Error('The query type received does not match to any of the types.');
                }

                const [userSelected] = await this.responsibiltiesRepository.selectUser(query.userId, query.locale);

                if (!userSelected.ClientID) {
                    throw new Error('The user does not exist');
                }

                const [getClientSettings] = await this.responsibiltiesRepository.getClientSettings(userSelected.ClientID);

                const searchCategoryData: SearchCategoriesRawDBResponse[] = await this.responsibiltiesRepository.searchSubCategory(
                    getClientSettings.JobDescriptionModelID ? getClientSettings.JobDescriptionModelID : 2,
                    DescriptionTypes[query.type],
                    query.locale,
                );
                if (!searchCategoryData || !searchCategoryData.length) {
                    throw new Error('No data found for searchSubCategory.');
                }

                return this.mapsearchCategoryData(searchCategoryData);
            }

            const subCategoryIds: number[] = query?.subCategoryIds.split('|').map(Number);
            if (subCategoryIds.length && subCategoryIds.length === 1 && subCategoryIds[0] === 0) {
                if (!query.type || !Object.keys(DescriptionTypes).includes(query.type)) {
                    throw new Error('The query type received does not match to any of the types.');
                }

                const responsibilitiesResponse: DescriptionDBResponse[] = await this.responsibiltiesRepository.getResponsibilityDescriptions(
                    query.loggedInUserClientId,
                    query.locale,
                    DescriptionTypes[query.type],
                );

                return this.mapDbDataforDescription(responsibilitiesResponse);
            }
            return this.getSuccessProfileDescriptions(query);
    }

    protected mapsearchCategoryData(dbData: SearchCategoriesRawDBResponse[]): SearchCategoryResponse {
        let responseData: SearchCategory[] = [];
        for (const categoryData of dbData || []) {
            const duplicateCategory = responseData.find(dupCat => dupCat.id === categoryData.JobCategoryID);
            if (duplicateCategory) {
                const duplicateSubCategory = duplicateCategory.subCategories.find(dupSub => dupSub.id === categoryData.JobSubCategoryID);
                if (!duplicateSubCategory) {
                    duplicateCategory.subCategories.push({
                        ...this.createSubCategories(categoryData),
                    });
                }
                continue;
            }
            responseData.push({
                ...this.createCategory(categoryData),
            });
        }
        return {
            id: dbData[0].JobSectionID || null,
            name: dbData[0].JobSectionName || null,
            description: dbData[0].JobSectionDescription.trim() || null,
            level: dbData[0].JobLevelLabel || null,
            subCategoryId: null,
            categories: responseData,
        };
    }

    protected createDescription(descriptionData): SearchCategoryDescriptions[] {
        return [
            {
                description: descriptionData.JobSubCategoryDescription.trim() || null,
                name: descriptionData.JobSubCategoryName.trim() || null,
                level: descriptionData.JobLevelOrder || null,
                levelLabel: descriptionData.JobLevelLabel || null,
            },
        ];
    }

    protected createSubCategories(subCategoryData): SearchCategorySubCategories {
        return {
            id: subCategoryData.JobSubCategoryID || null,
            shortProfile: subCategoryData.shortProfile || null,
            globalCode: subCategoryData.GlobalSubCategoryCode || null,
            definition: subCategoryData.JobSubCategoryDefinition || null,
            descriptions: this.createDescription(subCategoryData),
        };
    }

    protected createCategory(categoryData): SearchCategory {
        return {
            id: categoryData.JobCategoryID || null,
            name: categoryData.JobCategoryName || null,
            description: categoryData.JobCategoryDescription.trim() || null,
            subCategories: [
                {
                    ...this.createSubCategories(categoryData),
                },
            ],
        };
    }

    @LogErrors()
    async getSuccessProfileDescriptions(query: ResponsibilityDescriptionQuery): Promise<GetSuccessProfileDescriptionsResponse> {
            const subCategories: SubCategory[] = [];
            const getUserLocale: GetUserLocaleDBResponse[] = await this.responsibiltiesRepository.getUserCountryCode(query);
            query.locale =
                getUserLocale.length && getUserLocale[0] && getUserLocale[0]?.CountryCode && getUserLocale[0].CountryCode === Locale.GB
                    ? Locale.EN_UK
                    : query.locale;
            query.subCategoryIds = query.subCategoryIds.split('|').join(',');
            const getSuccessProfileDBDescriptionsResponse: GetSuccessProfileDescriptionsDBResponse[] =
                await this.responsibiltiesRepository.getSuccessProfileSubCategoryDescriptions(query);
            if (getSuccessProfileDBDescriptionsResponse.length) {
                const getSubCatagoryDependentDBResponse: GetDependentSubCategoryDBResponse[] =
                    await this.responsibiltiesRepository.getSuccessProfileSubCategoryDependentDescriptions(query);
                // @ts-ignore
                const getSubCategoryIds = [...new Set(getSuccessProfileDBDescriptionsResponse.map(item => item.JobSubCategoryID))];
                getSubCategoryIds.forEach(subCategoryId => {
                    const subCategoryDescriptionsResponse: GetSuccessProfileDescriptionsDBResponse[] = getSuccessProfileDBDescriptionsResponse.filter(
                        desc => desc.JobSubCategoryID === subCategoryId,
                    );
                    const subCategory: SubCategory = {
                        id:
                            subCategoryDescriptionsResponse && subCategoryDescriptionsResponse[0]?.JobSubCategoryID
                                ? subCategoryDescriptionsResponse[0].JobSubCategoryID
                                : 0,
                        definition:
                            subCategoryDescriptionsResponse && subCategoryDescriptionsResponse[0]?.JobSubCategoryDefinition
                                ? subCategoryDescriptionsResponse[0].JobSubCategoryDefinition
                                : '',
                        globalCode:
                            subCategoryDescriptionsResponse && subCategoryDescriptionsResponse[0]?.GlobalSubCategoryCode
                                ? subCategoryDescriptionsResponse[0].GlobalSubCategoryCode
                                : '',
                        descriptions: subCategoryDescriptionsResponse
                            ? this.transformSubCategoryDBDescriptionToSubCategoryDescrption(subCategoryDescriptionsResponse)
                            : [],
                        dependents: getSubCatagoryDependentDBResponse?.length
                            ? this.transformSubCategoryDependentDBResponseToSubCategoryDependentResponse(subCategoryId, getSubCatagoryDependentDBResponse)
                            : [],
                    };
                    subCategories.push(subCategory);
                });
            } else {
                throw new Error('No SucessProfile Descriptions found for given SubCategoryIds.');
            }
            const getSuccessProfileDescriptions: GetSuccessProfileDescriptionsResponse = { subCategories: subCategories };
            return getSuccessProfileDescriptions;
    }

    protected transformSubCategoryDBDescriptionToSubCategoryDescrption(
        subCategoryDescriptionResponse: GetSuccessProfileDescriptionsDBResponse[],
    ): Descriptions[] {
        const descriptions: Descriptions[] = subCategoryDescriptionResponse
            .filter(subCategory => subCategory.JobSubCategoryID === subCategoryDescriptionResponse[0].JobSubCategoryID)
            .map(description => {
                return {
                    name: description.JobSubCategoryName.trim(),
                    level: description.JobLevelOrder,
                    levelLabel: description.JobLevelLabel,
                    description: description.JobSubCategoryDescription.trim(),
                    default: description.default === 1,
                };
            });
        return descriptions;
    }

    protected removeEmptyParams(query: ResponsibilityDescriptionQuery): void {
        Object.keys(query).forEach(key => {
            if (!query[key]) {
                delete query[key];
            }
        });
    }

    protected transformSubCategoryDependentDBResponseToSubCategoryDependentResponse(
        subCategoryId: number,
        getSuccessProfileSubCatagoryDependentDBResponse: any[],
    ): GetDependentSubCategory[] {
        return getSuccessProfileSubCatagoryDependentDBResponse
            .filter(subCategory => subCategory.JobSubCategoryID === subCategoryId)
            .map(dependentSubCategory => {
                return {
                    jobSkillComponentName: dependentSubCategory.JobSkillComponentName,
                    isCore: toBoolean(dependentSubCategory.CoreSupportFlag),
                    jobSkillComponentID: dependentSubCategory.JobSkillComponentId,
                    jobSkillComponentCode: dependentSubCategory.JobSkillComponentCode,
                    jobSkillComponentGUID: dependentSubCategory.JobSkillComponentGUID,
                };
            });
    }

    @LogErrors()
    async responsibilitiesStatusUpdate(
        query: UpdateResponsibilityQuery,
        body: ResponsibilitiesStatusUpdateBody,
        type: SubcategoryType,
    ): Promise<ResponsibilitiesStatusUpdateResponse> {
            this.validateQueryForResponsibilitiesStatusUpdate(body);
            const returnValue: QueryUpdateCountValue = await this.responsibiltiesRepository.updateJobSubCategory(
                body.categories[0].id,
                body.categories[0].subCategories[0].id,
                body.categories[0].subCategories[0].isActive ? 1 : 0,
            );
            if (!returnValue?.affected) {
                throw 'No data exists for provided JobCategoryID and JobSubCategoryID';
            }
            const [itemModifiedResponse] = await this.responsibiltiesRepository.itemModificationSubCategory(type, query, new Date().toISOString());
            if (itemModifiedResponse?.ItemID) {
                const modelQuery: ModelQuery = {
                    preferredLocale: query.preferredLocale,
                    preferredClientId: query.preferredClientId,
                    modelVersion: query.modelVersion,
                    outputType: body.type,
                    loggedInUserClientId: query.loggedInUserClientId,
                    userId: query.userId,
                    locale: query.locale,
                };

                const [status] = await this.responsibiltiesRepository.getResponsibilitiesStatus(modelQuery);
                return {
                    status: status.Modification,
                };
            }
            throw safeString(`ItemID is not available for model version ${query.modelVersion}`);
    }

    validateQueryForResponsibilitiesStatusUpdate(body: ResponsibilitiesStatusUpdateBody): void {
        if (!body.type) {
            throw 'Type is missing';
        }
        if (!body.categories || !Array.isArray(body.categories) || !body.categories[0]?.id) {
            throw 'JobCategoryID is missing';
        }
        if (!body.categories[0].subCategories || !Array.isArray(body.categories[0].subCategories) || !body.categories[0].subCategories[0]?.id) {
            throw 'JobSubCategoryID is missing';
        }
        if (!body.categories[0].subCategories[0].hasOwnProperty('isActive') || !isBoolean(body.categories[0].subCategories[0].isActive)) {
            throw 'Toggle flag value is missing';
        }
    }
    isCustomFalseOrUndefined(isCustom: any): boolean {
        return isCustom === false;
    }

    @MapErrors({ errorCode: ec.EXTERNAL_IO_CALL_ERR })
    @LogErrors()
    async getTechnicalCompetencyModelByModelId(query: ModelQuery, modelId: string): Promise<NewModelAPIResponse> {
        this.validateQueryParams(query);
        const responsibilitiesDBResponse: NewModelDBResponse[] = await this.responsibiltiesRepository.getNewModelResponsibilities(query, modelId);
        if (responsibilitiesDBResponse.length) {
            const [status] = await this.responsibiltiesRepository.getResponsibilitiesStatus(query);
            return {
                models: this.mapNewModelsResponse(responsibilitiesDBResponse, query),
                status: status.Modification,
            };
        }
        throw new Error('Error: No data found for the given query params for getNewModelResponsibilities.');
    }
}
