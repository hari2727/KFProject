import { Injectable } from "@nestjs/common";
import { LoggerService } from '../../logger';
import { Loggers } from '../../_shared/log/loggers';
import { 
    TechnicalSkillRawResult, 
    SkillsApiResponseDto, 
    TechnicalSkillDto, 
    NewSearchDependantDBResponse, 
    GetSkillDetailResponse 
} from "./skills.interface";
import { 
    GetDetailDescription,
    GetResponsibilityDetailIdDBResponse,
} from '../responsibilities/responsibilities.interface';

/**
 * Transformer class responsible for converting raw database results into structured API responses
 * for technical skills data.
 */
@Injectable()
export class TechnicalSkillTransformer {
    protected logger: LoggerService;

    constructor(protected loggers: Loggers) {
        this.logger = loggers.getLogger(TechnicalSkillTransformer.name);
    }

    /**
     * Transforms raw database results into a structured API response.
     */
    transform(
        rawResults: TechnicalSkillRawResult[],
        pageIndex: number,
        pageSize: number
    ): SkillsApiResponseDto {
        // Handle empty results
        if (!rawResults || rawResults.length === 0) {
            return {
                skills: [],
                paging: {
                    pageIndex,
                    pageSize,
                    totalPages: 0,
                    totalResultRecords: 0,
                },
            };
        }

        // Extract total records from first result
        const totalRecords = parseInt(rawResults[0]?.TotalRecords, 10) || 0;

        // Create a map to group skills by dependent ID
        const dependentMap: { [key: number]: TechnicalSkillDto } = {};

        // Process each raw result
        rawResults.forEach((entry) => {
            const dependentId = Number(entry.JobSubCategoryDependantID);

            // Create new skill entry if it doesn't exist
            if (!dependentMap[dependentId]) {
                dependentMap[dependentId] = {
                    id: dependentId,
                    name: entry.JobSubCategoryDependantName,
                    isCore: entry.CoreSupportFlag === "true",
                    competencies: [],
                };
            }

            // Add competency if not already present
            const existingCompetency = dependentMap[dependentId].competencies.find(
                comp => comp.id === Number(entry.JobSubCategoryID)
            );

            if (!existingCompetency) {
                dependentMap[dependentId].competencies.push({
                    id: Number(entry.JobSubCategoryID),
                    name: entry.JobSubcategoryName,
                });
            }
        });

        // Build final response
        return {
            skills: Object.values(dependentMap),
            paging: {
                pageIndex,
                pageSize,
                totalPages: Math.ceil(totalRecords / pageSize),
                totalResultRecords: totalRecords,
            },
        };
    }

    /**
     * Transforms technical competency data into structured API response.
     */
    transformTechnicalCompetency(
        detailResponse: GetResponsibilityDetailIdDBResponse[], 
        dependentSkills: NewSearchDependantDBResponse[]
    ): GetSkillDetailResponse {
        this.logger.log(`Processing ${detailResponse.length} detail records`);
        this.logger.log(`Processing ${dependentSkills?.length || 0} dependent skills`);

        const uniqueSubCategories = Array.from(
            new Map(
                detailResponse.map(item => [item.JobSubCategoryId, item])
            ).values()
        );

        this.logger.log(`Found ${uniqueSubCategories.length} unique subcategories`);

        const subCategories = uniqueSubCategories.map(subCategory => {
            this.logger.log(`Processing subcategory ${subCategory.JobSubCategoryId}: ${subCategory.JobSubCategoryName}`);
            
            const descriptions = this.getDescriptions(subCategory, detailResponse);
            const dependentData = this.getDependentSkillsData(subCategory, dependentSkills);

            return {
                id: subCategory.JobSubCategoryId,
                name: subCategory.JobSubCategoryName,
                isCustom: Boolean(subCategory.IsCustomJobSubCategory),
                isActive: Boolean(subCategory.JobSubCategoryIsActive),
                definition: subCategory.JobSubCategoryDescription,
                originalDefinition: subCategory.JobSubCategoryOriginalDescription,
                originalName: subCategory.JobSubCategoryOriginalName,
                descriptions: descriptions,
                ...dependentData
            };
        });

        this.logger.log(`Transformation complete. Returning ${subCategories.length} subcategories`);
        return { subCategories };
    }

    /**
     * Extracts and maps job level descriptions for a subcategory.
     */
    private getDescriptions(
        subCategory: GetResponsibilityDetailIdDBResponse,
        details: GetResponsibilityDetailIdDBResponse[]
    ): GetDetailDescription[] {
        const filteredDetails = details
            .filter(detail => detail.JobSubCategoryId === subCategory.JobSubCategoryId);
        
        this.logger.log(`Processing ${filteredDetails.length} descriptions for subcategory ${subCategory.JobSubCategoryId}`);
        
        return filteredDetails.map(detail => ({
            id: detail.JobLevelDetailID,
            level: detail.JobLevelID,
            description: detail.JobLevelDetailDescription?.trim(),
            originalDescription: detail.OriginalJobLevelDescription,
            isCustom: Boolean(detail.IsCustomLevel)
        }));
    }

    /**
     * Processes dependent skills data for a subcategory.
     */
    private getDependentSkillsData(
        subCategory: GetResponsibilityDetailIdDBResponse,
        dependentSkills: NewSearchDependantDBResponse[]
    ) {
        const subcategoryDependents = dependentSkills?.filter(dep => 
            dep.JobSubCategoryID === subCategory.JobSubCategoryId
        );

        this.logger.log(`Found ${subcategoryDependents?.length || 0} dependent skills for subcategory ${subCategory.JobSubCategoryId}`);

        if (!subcategoryDependents?.length) {
            return {};
        }

        const [firstDependant] = subcategoryDependents;

        return {
            skillsCount: firstDependant.TotalSkills,
            coreSkillsCount: firstDependant.CoreCount,
            nonCoreSkillsCount: firstDependant.NonCoreCount,
            dependents: subcategoryDependents.map(dep => ({
                id: Number(dep.JobSubCategoryDependantID),
                name: dep.JobSubCategoryDependantName,
                isCore: dep.CoreSupportFlag === "true" || dep.CoreSupportFlag === true
            }))
        };
    }
} 