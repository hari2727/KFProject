import { KfhubCriticalExperienceService } from './kfhub-critical-experience.service';
import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { QueryProps } from '../../common/common.interface';
import { ExperienceBody, ExperienceProps, GETAPIValidParams } from './kfhub-critical-experience.interface';
import { AppCode as ec } from '../../app.const';
import { KfhubCriticalExperienceRoute } from './kfhub-critical-experience.route';
import { MapErrors } from '../../_shared/error/map-errors.decorator';

@Controller(KfhubCriticalExperienceRoute.BASE)
export class KfhubCriticalExperienceController {
    constructor(protected service: KfhubCriticalExperienceService) {}

    @Get()
    @MapErrors({ errorCode: ec.GET_CRITICAL_EXP_ERR })
    async handleGetRoute(@Query() query: GETAPIValidParams) {
        return await this.service.handleGetRoute(query);
    }

    // 201
    @Post()
    @MapErrors({ errorCode: ec.CREATE_CRITICAL_EXP_ERR })
    async handlePostRoute(@Body() body: ExperienceBody, @Query() query: QueryProps.Default) {
        return await this.service.postExperienceData(body);
    }

    @Put()
    @MapErrors({ errorCode: ec.UPDATE_CRITICAL_EXP_ERR })
    async handlePutRoute(@Body() body: ExperienceBody, @Query() query: ExperienceProps) {
        return await this.service.putExperienceData(body);
    }
}
