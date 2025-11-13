import { Body, Controller, Get, Post, Put, Query, Req } from '@nestjs/common';
import { KfTarcJobDescriptionsDetailsService } from './kftarc-job-descriptions-details.service';
import { KfTarcJobDescriptionsDetailsInterface as Kf } from './kftarc-job-descriptions-details.interface';
import { AppCode as ec } from '../../app.const';
import { KfTarcJobDescriptionsDetailsRoute } from './kftarc-job-descriptions-details.route';
import { MapErrors } from '../../_shared/error/map-errors.decorator';

@Controller(KfTarcJobDescriptionsDetailsRoute.BASE)
export class KfTarcJobDescriptionsDetailsController {
    constructor(protected service: KfTarcJobDescriptionsDetailsService) {}

    // apiTitle: 'Get JobDescriptions Details',
    @Get(KfTarcJobDescriptionsDetailsRoute.DETAILS)
    @MapErrors({ errorCode: ec.JOB_DESCRIPTIONS_DETAILS_ERR })
    async getJobDescriptionsDetails(@Query() query: Kf.JobDescriptionsGetDetailsRequest, @Req() request: Kf.RequestWithAuthToken): Promise<Object> {
        return await this.service.getJobDescriptionsDetails(+query.jdId, request);
    }

    // apiTitle: 'update JobDescriptions Details and trigger lambda',
    @Put(KfTarcJobDescriptionsDetailsRoute.DETAILS)
    @MapErrors({ errorCode: ec.JOB_DESCRIPTIONS_DETAILS_ERR })
    async putJobDescriptionsDetails( @Req() request: Kf.RequestWithAuthToken, @Body () body: Kf.JobDescriptionsDetailsRequest): Promise<Kf.JobDescriptionsDetailsObjectResponse> {
        return await this.service.putJobDescriptionsDetails(body.job, +body.clientId, +body.jdId, request);
    }

    // apiTitle: 'copy JobDescriptions Details and trigger lambda',
    @Post(KfTarcJobDescriptionsDetailsRoute.DETAILS)
    @MapErrors({ errorCode: ec.JOB_DESCRIPTIONS_DETAILS_ERR })
    async copyJobDescriptionsDetails(@Req() request: Kf.RequestWithAuthToken, @Body () body: Kf.JobDescriptionsDetailsRequest): Promise<Kf.JobDescriptionsDetailsObjectResponse> {
        return await this.service.copyJobDescriptionsDetails(body.job, +body.clientId, request);
    }

}
