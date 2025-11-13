import { Controller, Get, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { KfTarcRolesService } from './kftarc-roles.service';
import { KfTarcRolesInterface as Kf } from './kftarc-roles.interface';
import { KfTarcRolesRoute } from './kftarc-roles.route';

@Controller(KfTarcRolesRoute.BASE)
export class KfTarcRolesController {
    constructor(protected service: KfTarcRolesService) {}

    @Get()
    async getRoles(@Query() query: Kf.RolesQueryParams, @Req() request: Request): Promise<Kf.RolesList> {
        return await this.service.getRoles(query, request);
    }
}
