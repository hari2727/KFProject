import { Controller, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { ClientAction } from '../../bulkrunner/bulk-runner.const';
import { SuccessProfileSingleExportRoute } from './success-profile-single-export.route';
import { SuccessProfileSingleExportService } from './success-profile-single-export.service';

@Controller(SuccessProfileSingleExportRoute.BASE)
export class SuccessProfileSingleExportController {

    constructor(
        protected service: SuccessProfileSingleExportService,
    ) {}

    // apiTitle: 'BulkRunner driven SuccessProfile/JobDescription export',
    @Post(SuccessProfileSingleExportRoute.ACTION_PARAM)
    async handleAction(@Param('action') action: ClientAction, @Req() request: Request): Promise<any> {
        return await this.service.handleAction(action, request);
    }
}
