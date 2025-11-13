import { Controller, Get, Query } from '@nestjs/common';
import { KfTarcSpAndJdSearchService } from './kftarc-sp-and-jd-search.service';
import { AppCode as ec } from '../../../app.const';
import { KfTarcSpAndJdSearchRouteDetails, KfTarcSpAndJdSpResponse } from './kftarc-sp-and-jd-search.interface';
import { MapErrors } from '../../../_shared/error/map-errors.decorator';

@Controller(KfTarcSpAndJdSearchRouteDetails.KfTarcSpAndJdSearchRoute)
export class KfTarcSpAndJdSearchController{
    constructor(protected successProfilesAndJobDescriptionsSearchService: KfTarcSpAndJdSearchService){}

    // apiTitle: 'Search for success profiles and job descriptions',
    @Get()
    @MapErrors({ errorCode: ec.SEARCH_FOR_SUCCESS_PROFILES_AND_JOB_DESCRIPTIONS_ERR })
    async spAndJdSearch(@Query() query: KfTarcSpAndJdSearchRouteDetails.QueryParams): Promise<KfTarcSpAndJdSpResponse.Response>{
        return await this.successProfilesAndJobDescriptionsSearchService.spAndJdSearch(query);
    }
}
