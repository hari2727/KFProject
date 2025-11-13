import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger';
import { 
    JobCategoryLanguagesResponse, 
    JobCategoryLegacyLanguagesResponse,
    GetSkillDetailResponse,
    SkillsApiResponseDto,
    SkillsSearchFilterQuery,
    SkillsStatusUpdateResponse,
    UpdateSkillsStatusQuery,
    UpdateStatusOfModelItemForSkillsBody,
    UpdateSkillsBySkillIdBody,
    SkillType,
    ModelDataResponse,
    ModelDBResponse,
    OldModelAPIResponse,
    GetOldModelsByModelIdQuery,
    NewSearchDependantDBResponse,
    GetModelsForSkillsQuery
} from './skills.interface';
import { 
    GetResponsibilityDetailIdDBResponse,
    ModelQuery,
    UpdateResponsibilityQuery,
    SubcategoryType,
    ModelData,
    OldModelAPICategories,
    GetResponsibilityModelQuery
} from '../responsibilities/responsibilities.interface';
import { AppCode as ec } from '../../app.const';
import { MapErrors } from '../../_shared/error/map-errors.decorator';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { toNumber, toStringOr } from '../../_shared/convert';
import { TypeOrmHelper } from '../../_shared/db/typeorm.helper';
import { ResponsibilitiesService } from '../responsibilities/responsibilities.service';
import { ResponsibilitiesRepository } from '../responsibilities/responsibilities.repository';
import { QueryProps } from '../../common/common.interface';
import { TechnicalSkillTransformer } from './skills.transformer';
import { SkillsRepository } from './skills.repository';
import { Loggers } from '../../_shared/log/loggers';

@Injectable()
export class SkillsService {
    protected logger: LoggerService;

    constructor(
        protected sql: TypeOrmHelper,
        private readonly responsibilityService: ResponsibilitiesService,
        private readonly skillsRepository: SkillsRepository,
        private readonly technicalSkillTransformer: TechnicalSkillTransformer,
        private readonly responsibilitiesRepository: ResponsibilitiesRepository,
        private readonly loggers: Loggers,
    ) {
        this.logger = this.loggers.getLogger(SkillsService.name);
    }

    @MapErrors({ errorCode: ec.EXTERNAL_CALL_ERR })
    @LogErrors()
    async getJobCategoryLanguageDetails(clientId: number, jobCategoryId: string): Promise<JobCategoryLanguagesResponse> {
        const response: any[] = await this.sql.query(`
            exec CMM.dbo.GetCategoryDetails
                :clientId,
                :jobCategoryId
            `,
            {
                clientId: toNumber(clientId),
                jobCategoryId: toStringOr(jobCategoryId)
            }
        );
        return {
            [jobCategoryId]: response.map(row => ({
                locale: row['LcID'],
                jobFamilyName: row['JobFamilyName'],
                jobSubFamilyName: row['JobSubFamilyName'],
            }))
        };
    }

    @MapErrors({ errorCode: ec.EXTERNAL_IO_CALL_ERR })
    @LogErrors()
    async getJobCategoryLegacyLanguageDetails(clientId: number, jobCategoryId: string): Promise<JobCategoryLegacyLanguagesResponse> {
        const response: any[] = await this.sql.query(`
            exec CMM.dbo.Getjobcategorytranslation
                :clientId,
                :jobCategoryId
            `,
            {
                clientId: toNumber(clientId),
                jobCategoryId: toNumber(jobCategoryId)
            }
        );
        return {
            [jobCategoryId]: response.map(row => ({
                locale: row['LcID'] || row['LCID'],
                jobCategoryName: row['JobCategoryName'],
            }))
        };
    }

    @LogErrors()
    async publishSkills(query: QueryProps.Default): Promise<Response> {
        return await this.responsibilityService.responsibilitiesPublish(query, SubcategoryType.TECHNICAL_SKILLS);
    }

    @LogErrors()
    async getTechnicalCompetencies(query: GetResponsibilityModelQuery, id: number): Promise<GetSkillDetailResponse> {
        this.validateQueryParams(query);
        
        const detailResponse = await this.getDetailResponse(query, id);
        this.validateDetailResponse(detailResponse);

        const dependentSkills = await this.getDependentSkills(query, id);
        this.validateDependentSkills(dependentSkills);
        this.logger.debug(`detailResponse ${detailResponse}`);
        this.logger.debug(`dependentSkills ${dependentSkills}`);
        
        return this.technicalSkillTransformer.transformTechnicalCompetency(detailResponse, dependentSkills);
    }

    private validateDetailResponse(detailResponse: GetResponsibilityDetailIdDBResponse[]) {
        if (!detailResponse?.length) {
            throw new Error('No data found');
        }

        // Validate consistency of subcategory data
        const firstItem = detailResponse[0];
        const isConsistent = detailResponse.every(item => 
            item.JobSubCategoryId === firstItem.JobSubCategoryId &&
            item.JobSubCategoryName === firstItem.JobSubCategoryName &&
            item.JobSubCategoryDescription === firstItem.JobSubCategoryDescription
        );

        if (!isConsistent) {
            throw new Error('Inconsistent subcategory data');
        }

        // Validate job level sequence
        const jobLevels = detailResponse.map(item => item.JobLevelID);
        const isSequential = jobLevels.every((level, index) => 
            index === 0 || level > jobLevels[index - 1]
        );

        if (!isSequential) {
            this.logger.warn('Job levels are not in sequential order');
        }
    }

    private validateDependentSkills(dependentSkills: NewSearchDependantDBResponse[]) {
        // Skip validation if no dependent skills are provided
        if (!dependentSkills) {
            return;
        }

        // Validate skill counts consistency
        if (dependentSkills.length > 0) {
            // Check if sum of core and non-core skills matches total skills count for each skill
            const hasInconsistentCounts = dependentSkills.some(skill => {
                const calculatedTotal = skill.CoreCount + skill.NonCoreCount;
                if (calculatedTotal !== skill.TotalSkills) {
                    this.logger.warn(`Skill ${skill.JobSubCategoryDependantID} has inconsistent counts: Core(${skill.CoreCount}) + NonCore(${skill.NonCoreCount}) != Total(${skill.TotalSkills})`);
                    return true;
                }
                return false;
            });

            if (hasInconsistentCounts) {
                this.logger.warn('Inconsistent skill counts detected in dependent skills');
            }
        }

        // Validate CoreSupportFlag values
        dependentSkills.forEach(skill => {
            if (typeof skill.CoreSupportFlag !== 'boolean' && skill.CoreSupportFlag !== 'true' && skill.CoreSupportFlag !== 'false') {
                this.logger.warn(`Invalid CoreSupportFlag value for skill ${skill.JobSubCategoryDependantID}`);
            }
        });
    }

    private async getDetailResponse(query: GetResponsibilityModelQuery, id: number) {
        const detailResponse = await this.responsibilitiesRepository.getResponsibilityModelDetailId(query, id);
        
        if (!detailResponse?.length) {
            throw new Error('No data found');
        }

        return detailResponse;
    }

    private async getDependentSkills(query: GetResponsibilityModelQuery, id: number) {
        return await this.skillsRepository.searchDependents(
            id,
            query.preferredLocale,
            query.preferredClientId
        );
    }

    private validateQueryParams(query: any): void {
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
    async getModelsForSkillsByClientId(query: GetModelsForSkillsQuery): Promise<ModelDataResponse> {
        const modelDBResponse: ModelDBResponse[] = await this.responsibilitiesRepository.getResponsibilitiesModels(
            query,
        );

        const modelsresp: ModelData[] = this.responsibilityService.mapModelsResponse(modelDBResponse, SubcategoryType.TECHNICAL_SKILLS);
        return {
            models: modelsresp,
        };
    }

    @LogErrors()
    async getOldModelsByModelIdForSkills(query: GetOldModelsByModelIdQuery & ModelQuery, modelId: string): Promise<OldModelAPIResponse> {
        this.validateQueryParams(query);

        const [responsibilitiesDBResponse, [status]] = await Promise.all([
            this.responsibilitiesRepository.getOldModelResponsibilities(query, modelId),
            this.responsibilitiesRepository.getResponsibilitiesStatus(query),
        ]);

        const categories: OldModelAPICategories[] = this.responsibilityService.mapOldModelsResponse(responsibilitiesDBResponse);
        return {
            models: {
                categories,
            },
            status: status.Modification,
        };
    }

    @LogErrors()
    async UpdateModelItemStatusForSkills(
        query: UpdateSkillsStatusQuery & UpdateResponsibilityQuery, 
        body: UpdateStatusOfModelItemForSkillsBody, 
        type: SubcategoryType
    ): Promise<SkillsStatusUpdateResponse> {
        const response = await this.responsibilityService.responsibilitiesStatusUpdate(query, body, type);
        return {
            ...response,
            message: response.message || 'Status updated successfully'
        };
    }

    @LogErrors()
    async UpdateSkillsBySkillId(
        query: UpdateSkillsStatusQuery & UpdateResponsibilityQuery, 
        body: UpdateSkillsBySkillIdBody, 
        type: SubcategoryType
    ): Promise<Response> {
        return await this.responsibilityService.updateResponsibilities(query, body, type);
    }

    @LogErrors()
    async searchFilterSkills(queryParams: SkillsSearchFilterQuery): Promise<SkillsApiResponseDto> {
        const rawDBResults = await this.skillsRepository.searchSkills(queryParams);

        return this.technicalSkillTransformer.transform(
            rawDBResults,
            parseInt(queryParams.pageIndex),
            parseInt(queryParams.pageSize)
        );
    }
}
