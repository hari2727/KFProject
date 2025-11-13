import { Controller, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { ClientAction } from '../../bulkrunner/bulk-runner.const';
import { SuccessProfileMatrixExportRoute } from './success-profile-matrix-export.route';
import { SuccessProfileMatrixExportService } from './success-profile-matrix-export.service';

@Controller(SuccessProfileMatrixExportRoute.BASE)
export class SuccessProfileMatrixExportController {

    constructor(
        protected service: SuccessProfileMatrixExportService,
    ) {}

    // apiTitle: 'BulkRunner driven SuccessProfile Matrix export',
    @Post(SuccessProfileMatrixExportRoute.ACTION_PARAM)
    async handleAction(@Param('action') action: ClientAction, @Req() request: Request): Promise<any> {
        return await this.service.handleAction(action, request);
    }
}
