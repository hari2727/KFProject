import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
    BmBodyStage,
    BmQueryProps,
    BmQueryPropsCompLevels,
    BmQueryPropsComps,
    BmQueryPropsSpsData,
    BulkPublishStatusQueryParams,
    BulkPublishStatusResponse,
    Metadata,
    SkillsQueryProps,
    SkillsResonse,
    SpsData,
} from './bm.service.i';
import { BmRoute } from './bm.route';
import { BmService } from './bm.service';

import { Nullable } from '../../_shared/types';

@Controller(BmRoute.BASE)
export class BmController {
    constructor(protected service: BmService) {}

    // apiTitle: 'Get SPs data',
    @Get()
    async getSPs(@Query() query: BmQueryPropsSpsData): Promise<Nullable<SpsData.Response>> {
        return await this.service.getSPs(query);
    }

    // apiTitle: 'Get SPs filters',
    @Get(BmRoute.FILTERS)
    async getFilters(@Query() query: BmQueryProps): Promise<Metadata.Response> {
        return await this.service.getFilters(query);
    }

    // apiTitle: 'Get id and version of clients competencies model',
    @Get(BmRoute.MODELVERSION)
    async getCompetenceModelVersion(@Query() query: BmQueryProps) {
        return await this.service.getCompetenceModelVersion(query);
    }

    // apiTitle: 'Get clients behavior competencies model',
    @Get(BmRoute.COMPETENCIES)
    async getCompetenceModel(@Query() query: BmQueryPropsComps) {
        return await this.service.getCompetenceModel(query);
    }

    // apiTitle: 'Get Levels for list of Competencies (SubCategories)',
    @Get(BmRoute.LEVELS)
    async getCompLevels(@Query() query: BmQueryPropsCompLevels) {
        return await this.service.getCompLevels(query);
    }

    // apiTitle: 'Get SPs data',
    @Post()
    async stageBulkMap(@Query() query: BmQueryProps, @Body() body: BmBodyStage): Promise<any> {
        return await this.service.stageBulkMap(query, body);
    }

    // apiTitle: 'List of job categories and sub categories',
    @Get(BmRoute.SKILLS)
    async getSkillsModel(@Query() query: SkillsQueryProps): Promise<SkillsResonse> {
        return await this.service.getSkillsModel(query);
    }

    // apiTitle: 'Get Bulk Publish Status',
     @Get(BmRoute.PUBLISH_STATUS)
    async getBulkMappingPublishStatus(@Query() query: BulkPublishStatusQueryParams): Promise<BulkPublishStatusResponse> {
        return await this.service.getBulkMappingPublishStatus(query);
    }
}
