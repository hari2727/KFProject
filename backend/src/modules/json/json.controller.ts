import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { SuccessProfileJsonService } from './json.service';
import { SuccessProfileJsonRoute } from './json.route';
import { AppCode as ec } from '../../app.const';
import {
    GetJsonRequest,
    GetJsonResponse,
    RemoveJsonRequest,
    RemoveJsonResponse,
    StoreJsonRequest,
    StoreJsonResponse,
} from './json.interface';
import { MapErrors } from '../../_shared/error/map-errors.decorator';

@Controller(SuccessProfileJsonRoute.BASE)
export class SuccessProfileJsonController {
    constructor(protected service: SuccessProfileJsonService) {}

    // apiTitle: 'Save SuccessProfile JSON to DB'
    @Post()
    @MapErrors({ errorCode: ec.CERTIFICATION_ERR })
    async setFullJson(@Body() body: StoreJsonRequest): Promise<StoreJsonResponse> {
        return await this.service.setJson(+body.clientId, +body.id, body.json);
    }

    // apiTitle: 'Get SuccessProfile JSON from DB',
    @Get()
    @MapErrors({ errorCode: ec.CERTIFICATION_ERR })
    async getFullJson(@Query() query: GetJsonRequest): Promise<GetJsonResponse> {
        return await this.service.getJson(+query.clientId, +query.id);
    }

    // apiTitle: 'Delete SuccessProfile JSONs from DB',
    @Delete()
    @MapErrors({ errorCode: ec.CERTIFICATION_ERR })
    async removeFullJson(@Query() query: RemoveJsonRequest): Promise<RemoveJsonResponse> {
        return await this.service.removeJson(+query.clientId, query.ids);
    }

}
