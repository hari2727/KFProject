import { Body, Controller, Get, Put, Query } from '@nestjs/common';
import { KfTarcPMJobsVisibilityStatusService } from './kftarc-jobsvisibility-pm.service';
import { KfTarcPMJobsVisibilityStatusInterface as Kf } from './kftarc-jobsvisibility-pm.interface';
import { KfTarcPMJobsVisibilityStatusRoute } from './kftarc-jobsvisibility-pm.route';
import { QueryProps } from '../../common/common.interface';

@Controller(KfTarcPMJobsVisibilityStatusRoute.BASE)
export class KfTarcPMJobsVisibilityStatusController {
    constructor(protected service: KfTarcPMJobsVisibilityStatusService) {}

    @Get()
    async getVisibilityStatus(@Query() query: QueryProps.Default){
        return await this.service.getVisibilityStatus(query);
    }

    @Put()
    async updateVisibilityStatus(@Query() query: QueryProps.Default, @Body() body: Kf.StatusDTO){
        return await this.service.updateVisibilityStatus(query, body);
    }
}
