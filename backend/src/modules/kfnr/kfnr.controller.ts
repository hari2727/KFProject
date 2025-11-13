import { Controller, Get, Query, Req } from '@nestjs/common';
import { GetClientJobIdQueryParams, GetSpId, SuccessProfileDetailRequest } from './kfnr.interface';
import { KfnrRoute } from './kfnr.routes';
import { KfnrService } from './kfnr.service';

@Controller(KfnrRoute.BASE)
export class KfnrController {
    constructor(protected kfnrService: KfnrService) {}

    // apiTitle: 'Get SPID based on BIC code and Vesion No',
    @Get(KfnrRoute.SPID)
    async getSpid(@Query() query: GetSpId.QueryParams): Promise<GetSpId.Response> {
        return await this.kfnrService.getSpId(query.bicCode, query.versionNo);
    }

    // apiTitle: 'Get ClientJobDetail based on Job code and Grade',
    @Get(KfnrRoute.CLIENT_JOB_DETAIL)
    async getClientJobDetail(@Query() query: GetClientJobIdQueryParams, @Req() request: SuccessProfileDetailRequest): Promise<Object> {
        return await this.kfnrService.getClientJobDetail(query.jobCode, query.grade, request);
    }
}
