import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import {
    BulkOperationIdPayload,
    BulkOperationIdQuery,
    OverridenClientQuery
} from '../../bulk-update/bulk-update.types';
import { BulkMappingProfileCollectionsService } from './bmpc.service';
import { BulkMappingProfileCollectionsRoute } from './bmpc.route';
import { Request } from 'express';
import { UserService } from '../../common/user/user.service';
import { tryCustomClientIdValue } from '../../common/request.util';
import {
    BMPCChangesPayload,
    BMPCGetFiltersQuery,
    BMPCSearchProfilesPayload,
    BMPCSuccessProfileIdsPayload
} from './bmpc.types';

@Controller(BulkMappingProfileCollectionsRoute.BASE)
export class BulkMappingProfileCollectionsController {

    constructor(
        protected userService: UserService,
        protected service: BulkMappingProfileCollectionsService,
    ) {}

    protected async overrideQuery<T extends OverridenClientQuery>(request: Request, query: T): Promise<T> {
        const clientId = Number(await tryCustomClientIdValue(request, this.userService, query.preferredClientId));
        if (!clientId || clientId < 1) {
            throw `No valid clientId provided`;
        }
        return {
            ...query,
            loggedInUserClientId: clientId,
        };
    }

    @Post(BulkMappingProfileCollectionsRoute.PROFILES)
    async addProfiles(
        @Req() request: Request,
        @Query() query: OverridenClientQuery,
        @Body() body: BMPCSuccessProfileIdsPayload,
    ): Promise<any> {
        return await this.service.addProfiles(request, await this.overrideQuery(request, query), body);
    }

    @Get(BulkMappingProfileCollectionsRoute.FILTERS)
    async getFilters(
        @Req() request: Request,
        @Query() query: BMPCGetFiltersQuery & BulkOperationIdQuery & OverridenClientQuery,
    ): Promise<any> {
        return await this.service.getFilters(request, await this.overrideQuery(request, query));
    }

    @Post(BulkMappingProfileCollectionsRoute.SEARCH)
    async searchProfiles(
        @Req() request: Request,
        @Query() query: OverridenClientQuery,
        @Body() body: BMPCSearchProfilesPayload,
    ): Promise<any> {
        return await this.service.searchProfiles(request, await this.overrideQuery(request, query), body);
    }

    @Post(BulkMappingProfileCollectionsRoute.CHANGE)
    async addChanges(
        @Req() request: Request,
        @Query() query: OverridenClientQuery,
        @Body() body: BMPCChangesPayload,
    ): Promise<any> {
        return await this.service.addChanges(await this.overrideQuery(request, query), body);
    }

    @Post(BulkMappingProfileCollectionsRoute.APPLY_CHANGES)
    async applyChanges(
        @Req() request: Request,
        @Query() query: OverridenClientQuery,
        @Body() body: BulkOperationIdPayload,
    ): Promise<any> {
        return await this.service.applyChanges(await this.overrideQuery(request, query), body);
    }

}
