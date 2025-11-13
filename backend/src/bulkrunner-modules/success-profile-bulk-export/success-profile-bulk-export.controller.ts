import { Controller, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { ClientAction } from '../../bulkrunner/bulk-runner.const';
import { SuccessProfileBulkExportService } from './success-profile-bulk-export.service';
import { SuccessProfileBulkExportRoute } from './success-profile-bulk-export.route';

@Controller(SuccessProfileBulkExportRoute.BASE)
export class SuccessProfileBulkExportController {

    constructor(
        protected service: SuccessProfileBulkExportService,
    ) {}

    // apiTitle: 'BulkRunner driven SuccessProfile/JobDescription bulk export',
    @Post(SuccessProfileBulkExportRoute.ACTION_PARAM)
    async handleAction(@Param('action') action: ClientAction, @Req() request: Request): Promise<any> {
        return await this.service.handleAction(action, request);
    }
}
