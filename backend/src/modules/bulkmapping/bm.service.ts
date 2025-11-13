import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger';
import { okResponse } from '../../common/common.utils';
import {
    BulkPublishStatusDBResponse,
    CompetencyLevelRaw,
    CompetencyModelRaw,
    CompetencyRaw,
    SpsDataRaw,
    SpsIdsRaw,
    SpsMetaDataRaw
} from './bm-mssql.i';
import { ProfilesRepository, SubCategoryRepository } from './bm-mssql.repository';
import { BmMssqlService } from './bm-mssql.service';
import {
    CompetenceModelEntityType,
    GradeIndication,
    MetadataFilterValues,
    MetadataFilterValuesRemaped,
    SortBy,
    SpsFilters,
    SpsSortColumn
} from './bm.enum';
import {
    BmBodyStage,
    BmQueryProps,
    BmQueryPropsCompLevels,
    BmQueryPropsComps,
    BmQueryPropsSpsData,
    BmQueryPropsSpsDataDecoded,
    BulkPublishStatusQueryParams,
    BulkPublishStatusResponse,
    CompetenceModel,
    CompetenciesLevels,
    Metadata,
    SkillCategories,
    SkillDependents,
    SkillsQueryProps,
    SkillsResonse,
    SkillsResponseFromDB,
    SkillSubCategories,
    SpsData,
} from './bm.service.i';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { Nullable } from '../../_shared/types';
import { Loggers } from '../../_shared/log/loggers';
import { toBoolean, toNumber } from '../../_shared/convert';
import { safeLocale, safeNumber, safeString } from '../../_shared/safety';

@Injectable()
export class BmService {
    protected logger: LoggerService;

    constructor(
        protected mssqlService: BmMssqlService,
        protected mssqlProfiles: ProfilesRepository,
        protected mssqlSubCategory: SubCategoryRepository,
        protected loggers: Loggers,
    ) {
        this.logger = loggers.getLogger(BmService.name);
    }

    protected dbPageStartOffset = 1; //on UI pages start from 0

    @LogErrors()
    async getSPs(qRaw: BmQueryPropsSpsData): Promise<Nullable<SpsData.Response>> {
        const q = this.getDecodedQueryParams(qRaw);

        let { spsRaw, spsFilteredIdsRaw, spsAllIdsRaw } = await this.getSpData(q);

        const incorrectPageIndex = spsRaw.length === 0 && q.pageIndex > 0;
        if (incorrectPageIndex) {
            const { spsLastPg } = await this.getLastExistingPageData(q);
            spsRaw = spsLastPg;
        }

        this.warnOnEmptyArray(spsRaw, `No profiles found for client ${q.loggedInUserClientId}`);
        this.warnOnEmptyArray(spsFilteredIdsRaw, `No profile ids found for client ${q.loggedInUserClientId}`);
        this.warnOnEmptyArray(spsAllIdsRaw, `No profile ids found for client ${q.loggedInUserClientId}`);

        const sps = this.spsDataRemap(spsRaw);
        const spsFilteredIds = this.spsIdsRemap(spsFilteredIdsRaw);
        const spsAllIds = this.spsIdsRemap(spsAllIdsRaw);

        return {
            paging: {
                pageIndex: incorrectPageIndex ? this.calcSpLastDbPage(spsRaw, q) - this.dbPageStartOffset : q.pageIndex,
                pageSize: q.pageSize,
                totalPages: this.calcSpLastDbPage(spsRaw, q),
                totalResultRecords: spsRaw[0]?.TotalProfiles ? +spsRaw[0].TotalProfiles : 0,
            },
            jobs: sps,
            allJobsIds: spsAllIds,
            allJobsIdsByFilters: spsFilteredIds,
        };
    }

    protected getDecodedQueryParams(q: BmQueryPropsSpsData): BmQueryPropsSpsDataDecoded {
        const searchString = q.searchString || '',
            filterByStr = q.filterBy || '',
            filterValuesStr = q.filterValues || '';

        const filterBy = decodeURIComponent(filterByStr).split('|');
        const filterValues = decodeURIComponent(filterValuesStr)
            .split('|')
            .map(values => values.replace(/;/g, ','));

        const filters: { [key: string]: string } = filterBy.reduce((acc, filter, i) => Object.assign(acc, { [filter]: filterValues[i] }), {});
        const subAndFunctions =
            filters[SpsFilters.SUBFUNCTIONS] && filters[SpsFilters.FUNCTIONS]
                ? `${filters[SpsFilters.SUBFUNCTIONS]},${filters[SpsFilters.FUNCTIONS]}`
                : filters[SpsFilters.SUBFUNCTIONS] || filters[SpsFilters.FUNCTIONS] || '';

        this.spsValidateSortParams(q.sortBy, q.sortColumn, filters);

        return {
            loggedInUserClientId: q.loggedInUserClientId,
            userId: q.userId,
            locale: q.locale,
            custGrade: filters[GradeIndication.CUSTOM_GRADES] || '',
            grade: filters[GradeIndication.GRADES] || '',
            level: filters[SpsFilters.LEVELS] || '',
            subFunction: subAndFunctions,
            pageIndex: +(q.pageIndex || '0'),
            pageSize: +(q.pageSize || '20'),
            searchString: searchString,
            sortBy: (q.sortBy.split('|') || []).map(sort => SortBy[sort.toUpperCase()]).join('|') || SortBy.DESC,
            sortColumn: (q.sortColumn.split('|') || []).map(column => SpsSortColumn[column]).join('|') || SpsSortColumn.MODIFIED_ON,
        };
    }

    protected async getSpData(q: BmQueryPropsSpsDataDecoded) {
        const spsRawPromise = this.mssqlService.getClientProfilesAndIdsForBulkBC(
            q.loggedInUserClientId,
            q.userId,
            q.locale,
            q.custGrade,
            q.grade,
            q.level,
            q.pageIndex + this.dbPageStartOffset,
            q.pageSize,
            q.searchString,
            q.sortBy,
            q.sortColumn,
            q.subFunction,
        );

        const spsAllIdsRawPromise = this.mssqlService.getClientProfilesIdsForBulkBC(q.loggedInUserClientId, q.userId, q.locale);

        const [[spsRaw, spsFilteredIdsRaw], spsAllIdsRaw] = await Promise.all([spsRawPromise, spsAllIdsRawPromise]);

        return { spsRaw, spsFilteredIdsRaw, spsAllIdsRaw };
    }

    protected async getLastExistingPageData(q: BmQueryPropsSpsDataDecoded) {
        //If there 1...130 pages, but user trying to jump on page 1000 - this will return last existing page (130)
        const newQ = JSON.parse(JSON.stringify(q));
        newQ.pageIndex = 0;
        const { spsRaw: spsRawZeroPage } = await this.getSpData(newQ);
        if (spsRawZeroPage.length !== 0) {
            const lastPage = spsRawZeroPage[0]?.TotalProfiles && q.pageSize ? Math.ceil(+spsRawZeroPage[0].TotalProfiles / q.pageSize) : 0;
            newQ.pageIndex === lastPage;
            const { spsRaw: spsLastPg, spsFilteredIdsRaw: spsFilteredIdsLastPg, spsAllIdsRaw: spsAllIdsLastPg } = await this.getSpData(newQ);
            if (spsLastPg.length !== 0) {
                return { spsLastPg, spsFilteredIdsLastPg, spsAllIdsLastPg };
            }
        }
        return undefined;
    }

    protected calcSpLastDbPage(spsRaw: SpsDataRaw[], q: BmQueryPropsSpsDataDecoded): number {
        return spsRaw[0]?.TotalProfiles && q.pageSize ? Math.ceil(+spsRaw[0].TotalProfiles / q.pageSize) : 0;
    }

    protected spsValidateSortParams(sortBy: string, sortColumn: string, filters: { [key: string]: string }): void {
        if (sortColumn.split('|')?.length > 0 && !SpsSortColumn[sortColumn]) {
            this.logger.warn(safeString(`Error in getSPs data: wrong sortColumn param - ${sortColumn}`));
        }
        if (sortBy.split('|')?.length > 0 && !SortBy[sortBy]) {
            this.logger.warn(safeString(`Error in getSPs data: wrong sortBy param - ${sortBy}`));
        }
        Object.keys(filters).forEach(f => {
            if (!SpsFilters[f]) {
                this.logger.warn(safeString(`Error in getSPs data: wrong filter param - ${f}`));
            }
        });
    }

    protected spsDataRemap(spsDataRaw: SpsDataRaw[]): SpsData.SingleJob[] {
        return spsDataRaw.map(j => {
            const job: SpsData.SingleJob = {
                id: j.ClientJobId,
                title: j.JobTitle,
                levelName: j.KFManagementName,
                familyName: j.FunctionName,
                grade: this.constructCustomGrade(j.Grade, j.GradesetID, j.GradeSetName, j.MinGrade, j.MaxGrade, j.CustomGrade),
            };
            return job;
        });
    }

    removeEmptyProperties(grade: SpsData.Grade): void {
        Object.keys(grade).forEach(key => {
            if (!grade[key] || (key === 'customGrades' && !grade[key]?.grades)) {
                delete grade[key];
            }
        });
    }

    constructCustomGrade(
        standardHayGrade: string,
        gradeSetId?: string,
        gradeSetName?: string,
        minGrade?: string,
        maxGrade?: string,
        gradeLabels?: string,
    ): SpsData.Grade {
        let customGrades = null;
        if (gradeLabels) {
            //.slice(2) means that grades actually start after ||: ||grade1|||grade2|||grade3
            customGrades = {
                gradeSetId,
                gradeSetName,
                grades: gradeLabels
                    ? gradeLabels
                          .slice(2)
                          .split('|||')
                          .map(gradeLabel => ({
                              gradeLabel: gradeLabel,
                          }))
                    : null,
            };
        }
        const grades = {
            standardHayGrade,
            min: minGrade,
            max: maxGrade,
            customGrades,
        };
        this.removeEmptyProperties(grades);
        return grades;
    }

    protected spsIdsRemap(spsIdsRaw: SpsIdsRaw[]): number[] {
        return spsIdsRaw.length ? spsIdsRaw.map(e => +e.ClientJobId) : [];
    }

    protected warnOnEmptyArray(arr: any[], msg: string): boolean {
        if (!arr || arr.length === 0) {
            this.logger.warn(safeString(msg));
            return true;
        }
        return false;
    }

    protected errorOnEmptyArray(arr: any[], msg: string): void {
        if (!arr || arr.length === 0) {
            throw safeString(msg);
        }
    }

    @LogErrors()
    async getFilters(q: BmQueryProps): Promise<Metadata.Response> {
        const spsMetaDataRaw = await this.mssqlService.getBulkBCProfileMetadata(q.loggedInUserClientId, q.userId, q.locale);

        const noData = this.warnOnEmptyArray(spsMetaDataRaw, `No filter values found for client ${q.loggedInUserClientId}`);

        const ifPublishButtonEnabled = (await this.mssqlService.selectBulkMapItemId(q.loggedInUserClientId)).length > 0;

        let resp: Metadata.Response;
        if (noData) {
            resp = {
                metadata: [],
                isPublished: ifPublishButtonEnabled,
            };
            return resp;
        }

        const metaData = this.filtersRemap(spsMetaDataRaw);

        resp = {
            metadata: metaData,
            isPublished: ifPublishButtonEnabled,
        };

        return resp;
    }

    protected constructMetadataOptions(spsMetaDataRaw: SpsMetaDataRaw[]): [Metadata.PlainOption[], Metadata.PlainOption[], Metadata.NestedOption[]] {
        return spsMetaDataRaw.reduce(
            (totalArr: [Metadata.PlainOption[], Metadata.PlainOption[], Metadata.NestedOption[]], row) => {
                switch (row.MethodID) {
                    case MetadataFilterValues.LEVELS:
                        const levelOpts: Metadata.PlainOption = {
                            id: row.LevelID,
                            value: row.LevelName,
                            //name: row.LevelID,
                            order: +row.LevelOrder,
                        };
                        totalArr[0].push(levelOpts);
                        break;
                    case MetadataFilterValues.GRADES:
                    case MetadataFilterValues.CUSTOMGRADESET:
                        const gradeOpts: Metadata.PlainOption = {
                            id: row.LevelID,
                            value: row.LevelName,
                            name: row.LevelID,
                            order: +row.LevelOrder,
                            gradeIndication: row.MethodID,
                        };
                        totalArr[1].push(gradeOpts);
                        break;
                    case MetadataFilterValues.FUNCTIONS:
                        const ifFuncExistIndex = totalArr[2].findIndex((functOpts: Metadata.NestedOption) => functOpts.id === row.LevelID);
                        const funcSubOption: Metadata.NestedSubOptions = {
                            id: row.JobSubFamilyID,
                            value: row.JobSubFamilyName,
                        };
                        if (ifFuncExistIndex > -1) {
                            totalArr[2][ifFuncExistIndex].searchOn.subOptions.push(funcSubOption);
                        } else {
                            const functOpts: Metadata.NestedOption = {
                                id: row.LevelID,
                                value: row.LevelName,
                                searchOn: {
                                    name: SpsFilters.SUBFUNCTIONS,
                                    subOptions: [funcSubOption],
                                },
                            };
                            totalArr[2].push(functOpts);
                        }
                        break;
                }
                return totalArr;
            },
            [[], [], []],
        );
    }

    protected constructMetadata(
        metadataLevelsOptions: Metadata.PlainOption[],
        metadataGradesOptions: Metadata.PlainOption[],
        metadataFunctionsOptions: Metadata.NestedOption[],
    ): { metadataLevels: Metadata.Levels; metadataGrades: Metadata.Grades; metadataFunctions: Metadata.Functions } {
        const metadataLevels: Metadata.Levels = {
            id: 0,
            name: MetadataFilterValues.LEVELS,
            value: MetadataFilterValuesRemaped.LEVELS,
            options: metadataLevelsOptions.map(({ order, ...restProps }) => restProps),
        };
        const metadataGrades: Metadata.Grades = {
            id: 0,
            name: metadataGradesOptions[0].gradeIndication === MetadataFilterValues.CUSTOMGRADESET ? GradeIndication.CUSTOM_GRADES : GradeIndication.GRADES,
            value: MetadataFilterValuesRemaped.GRADES,
            options: metadataGradesOptions.map(({ order, gradeIndication, ...restProps }) => restProps),
        };
        const metadataFunctions: Metadata.Functions = {
            id: 0,
            name: MetadataFilterValues.FUNCTIONS,
            value: MetadataFilterValuesRemaped.FUNCTIONS,
            options: metadataFunctionsOptions.map(({ order, ...restProps }) => restProps),
        };
        return {
            metadataLevels,
            metadataGrades,
            metadataFunctions,
        };
    }

    protected sortMetadataOptions(metadataLevelsOptions: Metadata.PlainOption[], metadataGradesOptions: Metadata.PlainOption[]): void {
        metadataLevelsOptions.sort((a, b) => a.order - b.order);
        metadataGradesOptions.sort((a, b) => a.order - b.order);
    }

    protected joinMetadata(
        metadataLevels: Metadata.Levels,
        metadataGrades: Metadata.Grades,
        metadataFunctions: Metadata.Functions,
    ): (Metadata.Levels | Metadata.Grades | Metadata.Functions)[] {
        return [metadataLevels, metadataGrades, metadataFunctions].reduce((acc, metaData) => {
            if (metaData.options.length > 0) acc.push(Object.assign(metaData, { id: acc.length + 1 }));
            return acc;
        }, []);
    }

    protected filtersRemap(spsMetaDataRaw: SpsMetaDataRaw[]): (Metadata.Levels | Metadata.Grades | Metadata.Functions)[] {
        const [metadataLevelsOptions, metadataGradesOptions, metadataFunctionsOptions]: [
            Metadata.PlainOption[],
            Metadata.PlainOption[],
            Metadata.NestedOption[],
        ] = this.constructMetadataOptions(spsMetaDataRaw);

        this.sortMetadataOptions(metadataLevelsOptions, metadataGradesOptions);

        const { metadataLevels, metadataGrades, metadataFunctions } = this.constructMetadata(
            metadataLevelsOptions,
            metadataGradesOptions,
            metadataFunctionsOptions,
        );

        return this.joinMetadata(metadataLevels, metadataGrades, metadataFunctions);
    }

    @LogErrors()
    async getCompetenceModelVersion(q: BmQueryProps): Promise<CompetenceModel.Model> {
        const spsCompModelRaw: CompetencyModelRaw[] = await this.mssqlService.getClientsPublishedCompetencyModel(q.loggedInUserClientId);

        this.errorOnEmptyArray(spsCompModelRaw, `No modelguid and modelversion found for provided clientId: ${safeNumber(q.loggedInUserClientId)}`);

        const spsCompModel: CompetenceModel.Model = {
            modelGuid: spsCompModelRaw[0].CompetencyModelGUID,
            modelVersion: spsCompModelRaw[0].CompetencyModelVersion,
        };
        return spsCompModel;
    }

    @LogErrors()
    async getCompetenceModel(q: BmQueryPropsComps): Promise<CompetenceModel.Root> {
        const competenciesRaw: CompetencyRaw[] = await this.mssqlService.getClientPublishedCompetencies(q.modelguid, q.modelversion, q.locale);

        this.errorOnEmptyArray(competenciesRaw, `No competencies found for provided modelguid and modelversion: ${q.modelguid} ${q.modelversion}`);

        const factors = this.competenciesRemap(competenciesRaw);

        return {
            id: q.modelguid,
            version: q.modelversion,
            clientId: q.loggedInUserClientId,
            locale: q.locale,
            factors: factors,
        };
    }

    protected competenciesRemap(comps: CompetencyRaw[]): CompetenceModel.Factor[] {
        return comps.reduce((factors: CompetenceModel.Factor[], row: CompetencyRaw) => {
            let ifFactorExistIndex = this.getIndexById(factors, row.FactorId);

            if (ifFactorExistIndex === -1) {
                ifFactorExistIndex =
                    -1 +
                    factors.push({
                        id: row.FactorId,
                        type: CompetenceModelEntityType.FACTOR,
                        name: row.FactorName,
                        isActive: !!row.FactorIsActive,
                        isCustom: !!row.FactorIsCustom,
                        clusters: [],
                    });
            }

            let ifClusterExistIndex = this.getIndexById(factors[ifFactorExistIndex].clusters, row.ClusterId);
            if (ifClusterExistIndex === -1) {
                ifClusterExistIndex =
                    -1 +
                    factors[ifFactorExistIndex].clusters.push({
                        id: row.ClusterId,
                        type: CompetenceModelEntityType.CLUSTER,
                        name: row.ClusterName,
                        isActive: !!row.ClusterIsActive,
                        isCustom: !!row.ClusterIsCustom,
                        competencies: [],
                    });
            }

            let ifCompetencyExistIndex = this.getIndexById(factors[ifFactorExistIndex].clusters[ifClusterExistIndex].competencies, row.CompetencyId);
            if (ifCompetencyExistIndex === -1 && +row.CompetencyIsActive) {
                ifCompetencyExistIndex =
                    -1 +
                    factors[ifFactorExistIndex].clusters[ifClusterExistIndex].competencies.push({
                        id: row.CompetencyId,
                        type: CompetenceModelEntityType.COMPETENCY,
                        name: row.CompetencyName,
                        isActive: !!row.CompetencyIsActive,
                        isCustom: !!row.CompetencyIsCustom,
                        subCategoryId: +row.JobSubCategoryId,
                    });
            }

            return factors;
        }, []);
    }

    protected getIndexById(arr: CompetenceModel.CommonNested[], searchId: string | number): number {
        return arr.findIndex((obj: CompetenceModel.CommonNested) => obj.id === String(searchId));
    }

    @LogErrors()
    async getCompLevels(q: BmQueryPropsCompLevels): Promise<CompetenciesLevels.Response> {
        const subCategoryIds = decodeURIComponent(q.subCategoryIds).replace(/\|/g, ',');

        const compLevelsRaw = await this.mssqlService.getBulkBCClientsCompetencyLevels(q.loggedInUserClientId, q.locale, subCategoryIds);

        this.errorOnEmptyArray(compLevelsRaw, `No levels found for provided competencies: ${subCategoryIds}`);

        const compLevels = this.levelsRemap(compLevelsRaw);

        return { subCategories: compLevels };
    }

    protected levelsRemap(levels: CompetencyLevelRaw[]): CompetenciesLevels.SubCategory[] {
        return levels.reduce((totalArr: CompetenciesLevels.SubCategory[], row) => {
            let ifCompExistIndex = totalArr.findIndex((comp: CompetenciesLevels.SubCategory) => comp.id === +row.JobSubCategoryID);

            const level: CompetenciesLevels.Level = {
                level: +row.JobLevelOrder,
                levelLabel: row.JobLevelLabel,
                description: row.JobLevelDetailDescription,
            };

            if (ifCompExistIndex === -1) {
                const subCategory: CompetenciesLevels.SubCategory = {
                    id: +row.JobSubCategoryID,
                    name: row.JobSubCategoryName,
                    definition: row.JobSubCategoryDescription,
                    globalCode: row.GlobalSubCategoryCode,
                    descriptions: [],
                };
                ifCompExistIndex = totalArr.push(subCategory) - 1;
            }

            totalArr[ifCompExistIndex].descriptions.push(level);

            return totalArr;
        }, []);
    }

    @LogErrors()
    async stageBulkMap(q: BmQueryProps, body: BmBodyStage): Promise<any> {
        await this.mssqlService.insertBulkMapItemId(q.loggedInUserClientId, q.userId);

        const itemModificationIdRaw = await this.mssqlService.selectBulkMapItemId(q.loggedInUserClientId);

        this.errorOnEmptyArray(itemModificationIdRaw, `No itemModificationId found for provided clientId: ${q.loggedInUserClientId}`);

        const itemModificationId = itemModificationIdRaw[0].ItemModificationID;

        const profiles = body.successProfileIds.map(profId => ({ itemModificationId: toNumber(itemModificationId), clientJobId: profId }));
        const subCats = body.competencies.map(comp => Object.assign({ itemModificationId: toNumber(itemModificationId) }, comp));

        await Promise.all([this.mssqlProfiles.insertBulkMapProfiles(profiles), this.mssqlSubCategory.insertBulkMapSubCategory(subCats)]);

        return okResponse;
    }

    @LogErrors()
    async getSkillsModel(query: SkillsQueryProps): Promise<SkillsResonse> {
        if (!Number(query.preferredClientId)) {
            throw 'Preferred clientId must be a number';
        }
        if (!/^[a-z][a-z\-]+$/i.test(query.preferredLocale)) {
            throw 'Please provide valid preferred locale';
        }
        const skillsResponseFromDB: SkillsResponseFromDB[] = await this.mssqlService.selectClientPublishedSkills(query);

        this.errorOnEmptyArray(
            skillsResponseFromDB,
            `No skill categories are found for provided clientId and locale: ${query.preferredClientId} ${query.preferredLocale}`,
        );

        const categories = this.mapSkillCategories(skillsResponseFromDB);

        return {
            models: {
                categories,
            },
        };
    }

    protected mapSkillCategories(skillsResponseFromDB: SkillsResponseFromDB[]): SkillCategories[] {
        let categories = [];
        (skillsResponseFromDB || []).forEach((category: SkillsResponseFromDB) => {
            const findCategory = categories.find((categoryRes: any) => categoryRes.id === category.JobCategoryID);
            if (!findCategory) {
                const filteredCategories = skillsResponseFromDB.filter(
                    (categoryDB: SkillsResponseFromDB) => categoryDB.JobCategoryID === category.JobCategoryID && categoryDB.JobSubCategoryID,
                );
                categories.push({
                    id: category.JobCategoryID,
                    name: category.JobCategoryName,
                    description: category.JobCategoryDescription,
                    isCategoryEnabled: category.IsCategoryEnabled,
                    subCategories: this.getSubCategriesList(filteredCategories),
                });
            }
        });

        return categories;
    }

    protected getSubCategriesList(categories: SkillsResponseFromDB[]): SkillSubCategories[] {
        let subCategories: SkillSubCategories[] = [];
        categories.forEach((category: SkillsResponseFromDB) => {
            const dependents = categories.filter(
                (singleCategory: SkillsResponseFromDB) => singleCategory.JobSubCategoryID == category.JobSubCategoryID && category?.JobSkillComponentId,
            );
            const findSubCategory = subCategories.find((subCategory: SkillSubCategories) => subCategory.id === category.JobSubCategoryID);
            if (!findSubCategory) {
                subCategories.push({
                    id: category.JobSubCategoryID,
                    name: category.JobSubCategoryName,
                    order: category.JobSubCategoryOrder,
                    isCustom: Boolean(category.IsCustomJobSubCategory),
                    definition: category.JobSubCategoryDescription,
                    skillsCount: category.SkillsCount,
                    ...(dependents.length ? { dependents: this.getDependentsList(dependents) } : {}),
                });
            }
        });
        return subCategories;
    }

    protected getDependentsList(skilDependents: SkillsResponseFromDB[]): SkillDependents[] {
        return skilDependents.map((dependent: SkillsResponseFromDB) => ({
            jobSkillComponentId: dependent.JobSkillComponentId,
            jobSkillComponentCode: dependent.JobSkillComponentCode,
            jobSkillComponentGUID: dependent.JobSkillComponentGUID,
            jobSkillComponentName: dependent.JobSkillComponentName,
            isCore: toBoolean(dependent.CoreSupportFlag),
        }));
    }

    @LogErrors()
    async getBulkMappingPublishStatus(queryParams: BulkPublishStatusQueryParams): Promise<BulkPublishStatusResponse> {
            const bulkPublishStatusResponse: BulkPublishStatusDBResponse[] = await this.mssqlService.getBulkMappingPublishStatus(queryParams);
            if (bulkPublishStatusResponse.length) {
                return this.convertBulkPublishDBResponseToBulkPublishStatusResponse(bulkPublishStatusResponse[0]);
            } else {
                throw `Nil Status Returned for ClientId and Locale : ${safeNumber(queryParams.preferredClientId)} ${safeLocale(queryParams.preferredLocale)}`;
            }
    }

    convertBulkPublishDBResponseToBulkPublishStatusResponse(bulkPublishStatus: BulkPublishStatusDBResponse): BulkPublishStatusResponse {
        const bulkPublishStatusResponse: BulkPublishStatusResponse = {
            competenciesPublishStatus: bulkPublishStatus.CompetencyModelStatus === 1,
            functionsPublishStatus: bulkPublishStatus.FamilyModelStatus === 1,
            responsibilitiesPublishStatus: bulkPublishStatus.RespModelStatus === 1,
            skillsPublishStatus: bulkPublishStatus.SkillModelStatus === 1,
        };
        return bulkPublishStatusResponse;
    }
}
