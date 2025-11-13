import { Body, Controller, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { SkillsRoute } from './skills.route';
import { GetModelsForSkillsQuery, GetOldModelsByModelIdQuery, GetResponsibilityModelQuery, GetSkillDetailResponse, JobCategoryQuery, SkillsSearchFilterQuery, UpdateSkillsBySkillIdBody, UpdateSkillsStatusQuery, UpdateStatusOfModelItemForSkillsBody } from './skills.interface';
import { SkillsService } from './skills.service';
import { UserService } from '../../common/user/user.service';
import { tryCustomClientIdValue } from '../../common/request.util';
import { ResponsibilitiesService } from '../responsibilities/responsibilities.service';
import { AddNewSubcategories, ModelDataResponse, ModelQuery, NewModelAPIResponse, SubcategoryType, UpdateResponsibilityQuery } from '../responsibilities/responsibilities.interface';

@Controller(SkillsRoute.BASE)
export class SkillsController {
    constructor(
        protected service: SkillsService,
        protected userService: UserService,
        protected responsibilitiesService: ResponsibilitiesService,
    ) {}

    @Get(SkillsRoute.JOB_CATEGORY + SkillsRoute.LANGUAGES)
    async getJobCategoryLanguages(@Req() request: Request, @Query() query: JobCategoryQuery): Promise<any> {
        const clientId = await tryCustomClientIdValue(request, this.userService, query.preferredClientId);
        return await this.service.getJobCategoryLanguageDetails(clientId, query.jobCategoryId);
    }

    @Get(SkillsRoute.JOB_CATEGORY + SkillsRoute.LEGACY_LANGUAGES)
    async getJobCategoryLegacyLanguages(@Req() request: Request, @Query() query: JobCategoryQuery): Promise<any> {
        const clientId = await tryCustomClientIdValue(request, this.userService, query.preferredClientId);
        return await this.service.getJobCategoryLegacyLanguageDetails(clientId, query.jobCategoryId);
    }

    // apiTitle: 'Add new skills',
    @Post(SkillsRoute.NEW_SKILLS)
    async addNewSkills(@Query() query: AddNewSubcategories.Query, @Body() body: AddNewSubcategories.Body): Promise<any> {
        return await this.responsibilitiesService.addNewSubcategories(query, body, SubcategoryType.TECHNICAL_SKILLS);
    }

    //apiTitle: 'Get Single Skill Details By Id'
    @Get(SkillsRoute.GET_TECHNICAL_COMPETENCIES + SkillsRoute.ID)
    async getTechnicalCompetencies(@Param('id') id: number, @Query() query: GetResponsibilityModelQuery): Promise<GetSkillDetailResponse> {
        return await this.service.getTechnicalCompetencies(query, id);
    } 
    //apiTitle: 'List of new model responsibilities'
    @Get(SkillsRoute.TECHNICAL_COMPETENCY_MODEL + SkillsRoute.ID)
    async getTechnicalCompetencyModelByModelId(@Query() query: ModelQuery, @Param('id') modelId: string): Promise<NewModelAPIResponse> {
        return await this.responsibilitiesService.getTechnicalCompetencyModelByModelId(query, modelId);
    }

    @Post(SkillsRoute.PUBLISH_SKILLS)
    async publishSkills(@Query() query: ModelQuery): Promise<any> {
        return await this.service.publishSkills(query);
    }

    @Get(SkillsRoute.SEARCH_FILTER)
    async searchFilterSkills(@Query() query: SkillsSearchFilterQuery): Promise<any> {
        return await this.service.searchFilterSkills(query);
    }

    @Get(SkillsRoute.MODELS)
    async getModelsForSkills(@Query() query: GetModelsForSkillsQuery): Promise<ModelDataResponse> {
        return await this.service.getModelsForSkillsByClientId(query);
    }

    @Get(SkillsRoute.OLD_MODELS_FOR_SKILLS_BY_MODEL_ID)
    async getOldModelsByModelId(@Query() query: GetOldModelsByModelIdQuery & ModelQuery, @Param('id') modelId: string): Promise<any> {
        return await this.service.getOldModelsByModelIdForSkills(query, modelId);
    }

    @Put(SkillsRoute.UPDATE_MODEL_ITEM_STATUS)
    async updateModelItemStatus(
        @Query() query: UpdateSkillsStatusQuery & UpdateResponsibilityQuery, 
        @Body() body: UpdateStatusOfModelItemForSkillsBody
    ): Promise<any> {
        return await this.service.UpdateModelItemStatusForSkills(query, body, SubcategoryType.TECHNICAL_SKILLS);
    }

    @Put(SkillsRoute.UPDATE_MODEL)
    async updateSkillsBySkillId(
        @Query() query: UpdateSkillsStatusQuery & UpdateResponsibilityQuery,
        @Body() body: UpdateSkillsBySkillIdBody
    ): Promise<any> {
        return await this.service.UpdateSkillsBySkillId(query, body, SubcategoryType.TECHNICAL_SKILLS);
    }
}
