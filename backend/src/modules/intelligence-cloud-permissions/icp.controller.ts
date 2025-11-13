import { Controller, Get, Query } from '@nestjs/common';
import { GetIntelligenceCloudPermissionsRequest, IntelligenceCloudPermissions } from './icp.interface';
import { IntelligenceCloudPermissionsService } from './icp.service';
import { IntelligenceCloudPermissionsRoute } from './icp.route';

@Controller(IntelligenceCloudPermissionsRoute.BASE)
export class IntelligenceCloudPermissionsController {
    constructor(protected service: IntelligenceCloudPermissionsService) {}

    // apiTitle: 'Get IC Users permissions',
    @Get()
    async getPermissions(@Query() query: GetIntelligenceCloudPermissionsRequest): Promise<IntelligenceCloudPermissions> {
        return await this.service.getPermissions(query);
    }
}
