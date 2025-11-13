import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { QueryProps } from '../../common/common.interface';
import { ResponsibilitiesRoute } from './responsibilities.route';
import {
    AddNewSubcategories,
    DescriptionsResponse,
    GetResponsibilityDetailIdResponse,
    GetResponsibilityModelQuery,
    GetSuccessProfileDescriptionsResponse,
    ModelDataResponse,
    ModelQuery,
    OldModelAPIResponse,
    ResponsibilitiesStatusUpdateBody,
    ResponsibilitiesStatusUpdateResponse,
    ResponsibilityDescriptionQuery,
    SearchCategoryResponse,
    SubcategoryType,
    UpdateResponsibilityBody,
    UpdateResponsibilityQuery,
} from './responsibilities.interface';
import { ResponsibilitiesService } from './responsibilities.service';

@Controller(ResponsibilitiesRoute.BASE)
export class ResponsibilitiesController {
    constructor(protected responsibilitiesService: ResponsibilitiesService) {}

    // apiTitle: 'List of old model responsibilities',
    @Get(ResponsibilitiesRoute.OLD_MODEL + ResponsibilitiesRoute.ID)
    async oldModelResponsibilities(@Query() query: ModelQuery, @Param('id') modelId: string): Promise<OldModelAPIResponse> {
        return await this.responsibilitiesService.getOldModelResponsibilities(query, modelId);
    }

    // apiTitle: 'List of responsibilities Models',
    @Get(ResponsibilitiesRoute.MODELS)
    async modelResponsibilities(@Query() query: GetResponsibilityModelQuery): Promise<ModelDataResponse> {
        return await this.responsibilitiesService.getModelResponsibilities(query);
    }

    // apiTitle: 'List of new model responsibilities',
    @Get(ResponsibilitiesRoute.NEW_MODEL + ResponsibilitiesRoute.ID)
    async newModelResponsibilities(@Query() query: ModelQuery, @Param('id') modelId: string): Promise<OldModelAPIResponse> {
        return await this.responsibilitiesService.getNewModelResponsibilities(query, modelId);
    }

    // apiTitle: 'GET Single Responsibility Detail Id',
    @Get(ResponsibilitiesRoute.MODELS + '/:id')
    async getResponsibilityDetailById(@Param('id') id: number, @Query() query: GetResponsibilityModelQuery): Promise<GetResponsibilityDetailIdResponse> {
        return await this.responsibilitiesService.getResponsibilityModelDetailId(query, id);
    }

    // apiTitle: 'Update responsibilities status on toggle change',
    @Put(ResponsibilitiesRoute.UPDATE_STATUS)
    async updateResponsibilityStatus(
        @Query() query: UpdateResponsibilityQuery,
        @Body() body: ResponsibilitiesStatusUpdateBody,
    ): Promise<ResponsibilitiesStatusUpdateResponse> {
        return await this.responsibilitiesService.responsibilitiesStatusUpdate(query, body, SubcategoryType.RESPONSIBILITY);
    }

    // apiTitle: 'publish responsibilities',
    @Post(ResponsibilitiesRoute.PUBLISH)
    async publishResponsibilities(@Query() query: QueryProps.Default): Promise<any> {
        return await this.responsibilitiesService.responsibilitiesPublish(query, SubcategoryType.RESPONSIBILITY);
    }

    // apiTitle: 'Add new responsibility',
    @Post(ResponsibilitiesRoute.NEW_RESPONSIBILITIES)
    async addNewResponsibility(@Query() query: AddNewSubcategories.Query, @Body() body: AddNewSubcategories.Body): Promise<any> {
        return await this.responsibilitiesService.addNewSubcategories(query, body, SubcategoryType.RESPONSIBILITY);
    }

    // apiTitle: 'GET details depending on type sent in params',
    @Get(ResponsibilitiesRoute.DESCRIPTIONS)
    async getDescriptionsDetails(
        @Query() query: ResponsibilityDescriptionQuery,
    ): Promise<DescriptionsResponse | GetSuccessProfileDescriptionsResponse | SearchCategoryResponse> {
        return await this.responsibilitiesService.responsibilityDescriptions(query);
    }

    // apiTitle: 'GET details depending on type sent in params',
    @Put('/:id')
    async updateResponsibilities(@Query() query: UpdateResponsibilityQuery, @Body() body: UpdateResponsibilityBody): Promise<any> {
        return await this.responsibilitiesService.updateResponsibilities(query, body, SubcategoryType.RESPONSIBILITY);
    }
}
