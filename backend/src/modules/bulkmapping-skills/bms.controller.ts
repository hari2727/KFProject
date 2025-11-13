import { Body, Controller, Post, Query } from '@nestjs/common';
import { BulkMappingSkillsRoute } from './bms.route';
import {
    BulkMappingSkillsQuery,
    BulkMappingSkillsStagingPayload,
    BulkMappingSkillsStagingResponse
} from './bms.interfaces';
import { BulkMappingSkillsService } from './bms.service';

@Controller(BulkMappingSkillsRoute.BASE)
export class BulkMappingSkillsController {

    constructor(protected service: BulkMappingSkillsService) {}

    // apiTitle: 'Send skill and components binding into the staging table in a bulk',
    @Post()
    async stageSkillComponents(@Query() query: BulkMappingSkillsQuery, @Body() body: BulkMappingSkillsStagingPayload): Promise<BulkMappingSkillsStagingResponse> {
        return await this.service.stageSkillComponents(query, body);
    }

}
