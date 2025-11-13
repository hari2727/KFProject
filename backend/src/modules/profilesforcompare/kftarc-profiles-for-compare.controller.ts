import { Controller, Get, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { ProfileCompareQuery, ProfileMatchAndCompareResponse } from './kftarc-profiles-for-compare.interface';
import { KfTarcProfilesForCompareRoute } from './kftarc-profiles-for-compare.route';
import { KfTarcProfilesForCompareService } from './kftarc-profiles-for-compare.service';

@Controller(KfTarcProfilesForCompareRoute.BASE)
export class KfTarcProfilesForCompareController {
    constructor(protected jobsForCompareService: KfTarcProfilesForCompareService) {}

    // apiTitle: 'Get jobs for compare',
    @Get()
    async getJobsForCompare(@Query() query, @Req() request: Request) {
        return await this.jobsForCompareService.getJobsInBulk(query, request);
    }

    // apiTitle: 'Get jobs for compare by job role type id',
    @Get(KfTarcProfilesForCompareRoute.GET_JOB_ROLE_TYPE_ID)
    async getJobsByJobRoleTypeId(@Query() query:ProfileCompareQuery):Promise<ProfileMatchAndCompareResponse[]>{
        return await this.jobsForCompareService.getJobRoleTypeById(query);
    }
}
