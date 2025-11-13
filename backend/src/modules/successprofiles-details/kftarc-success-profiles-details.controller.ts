import { Body, Controller, Get, Post, Put, Query, Req } from '@nestjs/common';
import { KfTarcSuccessProfilesDetailsService } from './kftarc-success-profiles-details.service';
import { KfTarcSuccessProfileDetailsInterface as Kf } from './kftarc-success-profiles-details.interface';
import { AppCode as ec } from '../../app.const';
import { KfTarcSuccessProfileDetailsRoute } from './kftarc-success-profiles-details.route';
import { MapErrors } from '../../_shared/error/map-errors.decorator';

@Controller(KfTarcSuccessProfileDetailsRoute.BASE)
export class KfTarcSuccessProfileDetailsController {
    constructor(protected service: KfTarcSuccessProfilesDetailsService) {}

    // apiTitle: 'Get SuccessProfiles Details',
    @Get()
    @MapErrors({ errorCode: ec.SUCCESS_PROFILES_DETAILS_ERR })
    async getSuccessProfileDetails(@Query() query: Kf.SuccessProfileGetDetailsRequest, @Req() request: Kf.RequestWithAuthToken): Promise<Object> {
        return await this.service.getSuccessProfileDetails(+query.spId, request);
    }

    // apiTitle: 'update SuccessProfiles Details and trigger lambda',
    @Put()
    @MapErrors({ errorCode: ec.SUCCESS_PROFILES_DETAILS_ERR })
    async putSuccessProfileDetails( @Req() request: Kf.RequestWithAuthToken, @Body () body: Kf.SuccessProfileDetailsRequest): Promise<Kf.SuccessProfileDetailsObjectResponse> {
        return await this.service.putSuccessProfileDetails(body.job, +body.clientId, +body.spId, request);
    }

    // apiTitle: 'copy SuccessProfiles Details and trigger lambda',
    @Post()
    @MapErrors({ errorCode: ec.SUCCESS_PROFILES_DETAILS_ERR })
    async copySuccessProfileDetails(@Req() request: Kf.RequestWithAuthToken, @Body () body: Kf.SuccessProfileDetailsRequest): Promise<Kf.SuccessProfileDetailsObjectResponse> {
        return await this.service.copySuccessProfileDetails(body.job, +body.clientId, request);
    }

}
