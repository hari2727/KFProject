import { AppCode as ec } from '../../app.const';
import { KfTarcSpMatrixRequestDetails, KfTarcSpMatrixResponse } from './kftarc-sp-matrix.interface';
import { Controller, Get, Query } from '@nestjs/common';
import { KfTarcSpMatrixService } from './kftarc-sp-matrix.service';
import { MapErrors } from '../../_shared/error/map-errors.decorator';

@Controller(KfTarcSpMatrixRequestDetails.ROUTE)
export class KfTarcSpMatrixController{
    constructor(protected successProfileMatrixService: KfTarcSpMatrixService){}

    // apiTitle: 'Search for success profiles and job descriptions',
    @Get()
    @MapErrors({ errorCode: ec.MATRIX_SUCCESS_PROFILES_ERR })
    async spAndJdSearch(@Query() query: KfTarcSpMatrixRequestDetails.QueryParams): Promise<KfTarcSpMatrixResponse.Response>{
        return await this.successProfileMatrixService.spMatrix(query);
    }
}
