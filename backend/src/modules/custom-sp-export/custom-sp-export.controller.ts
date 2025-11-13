import { Body, Controller, Headers, Post, Query, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { HcmExportService } from './custom-sp-export.service';
import { HcmExportRoute } from './custom-sp-export.route';
import { AppCode as ec } from '../../app.const';
import { Request, Response } from 'express';
import {  HCMExportRequestQuery, HCMExportRequestBody, HcmSpExportReqBody, HcmSpExportQuery } from './interfaces';
import { MapErrors } from '../../_shared/error/map-errors.decorator';

@Controller(HcmExportRoute.BASE)
@UsePipes(new ValidationPipe({
    transform: true,
}))
export class HcmExportController {
    constructor(protected service: HcmExportService) {}


    // apiTitle: 'export custom sp as excel',
    @Post('/export')
    @MapErrors({ errorCode: ec.CERTIFICATION_ERR })
    async export(@Query() query: HcmSpExportQuery, @Req() request: Request, @Body() body: HcmSpExportReqBody): Promise<any> {
        request.setTimeout(900000);

        return await this.service.hcmCustomSpExport(query, body);
    }

    // apiTitle: 'export custom HCm with X-api key',
    @Post('/exporthcm')
    @MapErrors({ errorCode: ec.CERTIFICATION_ERR })
    async exportHcm(@Query() query: HCMExportRequestQuery, @Req() request: Request, @Body() body: HCMExportRequestBody): Promise<any> {
        request.setTimeout(900000);

        return await this.service.customSpExportHcm(query, body);
    }

}
