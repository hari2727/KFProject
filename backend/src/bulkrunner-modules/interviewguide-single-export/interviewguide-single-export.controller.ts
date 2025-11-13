import { Controller, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { ClientAction } from '../../bulkrunner/bulk-runner.const';
import { InterviewGuideSingleExportRoute } from './interviewguide-single-export.route';
import { InterviewGuideSingleExportService } from './interviewguide-single-export.service';

@Controller(InterviewGuideSingleExportRoute.BASE)
export class InterviewGuideSingleExportController {

    constructor(
        protected service: InterviewGuideSingleExportService,
    ) {}

    @Post(':action')
    async handleAction(@Param('action') action: ClientAction, @Req() request: Request): Promise<any> {
        return await this.service.handleAction(action, request);
    }
}
