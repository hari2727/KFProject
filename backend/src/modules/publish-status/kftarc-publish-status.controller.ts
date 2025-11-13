import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { PublishStatusService } from './kftarc-publish-status.service';
import { KfTarcPublishStatusRoute } from './kftarc-publish-status.route';
import { PublishStatusQuery, RepublishPayload } from './kftarc-publish-status.interface';
import { QueryProps } from '../../common/common.interface';

@Controller(KfTarcPublishStatusRoute.BASE)
export class KfTarcPublishStatusController {
    constructor(protected publishStatusService: PublishStatusService) {}

    // apiTitle: 'get Publish Status',
    @Get()
    async getPublishStatus(@Query() query: PublishStatusQuery) {
        return await this.publishStatusService.getPublishStatus(query);
    }

    // apiTitle: 'republished failed BehavioralCompetencies-SuccessProfile mapping',
    @Put(KfTarcPublishStatusRoute.ACTION)
    async actionSwitcher(@Param('action') action: string, @Query() query: QueryProps.Default, @Body() body: RepublishPayload)  {
        return await this.publishStatusService.actionSwitcher(action, query, body);
    }
}
