import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { KfTarcCertificationService } from './kftarc-certification.service';
import { KfTarcCertificationInterface as Kf } from './kftarc-certification.interface';
import { AppCode as ec } from '../../app.const';
import { KfTarcCertificationRoute } from './kftarc-certification.route';
import { MapErrors } from '../../_shared/error/map-errors.decorator';

@Controller(KfTarcCertificationRoute.BASE)
export class KfTarcCertificationController {
    constructor(protected service: KfTarcCertificationService) {}

    // apiTitle: 'Get client job certificates',
    @Get()
    @MapErrors({ errorCode: ec.CERTIFICATION_ERR })
    async getCertificates(@Query() query: Kf.GetCertificatesQueryParams, @Req() request: Kf.RequestWithHeaders): Promise<Kf.GetCertificatesResponse> {
        return await this.service.getCertificates(query, request);
    }

    // apiTitle: 'Upsert (update or insert) client job certificates',
    @Post()
    @MapErrors({ errorCode: ec.CERTIFICATION_ERR })
    async postCertificates(@Query() query: Kf.PostCertificatesQueryParams, @Req() request: Kf.RequestWithHeaders, @Body() body: Kf.PostCertificatesPayload ): Promise<Kf.DatabaseResponse> {
        return await this.service.postCertificates(query, request, body);
    }
}
