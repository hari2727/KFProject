import { Controller, Get, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { SummaryRoute } from './summary.route';
import { SuccessProfileDashboardSummaryService } from './summary.service';
import { SummaryDashboardResponse, SummaryQuery } from './summary.interface';

@Controller(SummaryRoute.BASE)
export class SuccessProfileSummaryController {
    constructor(protected service: SuccessProfileDashboardSummaryService) {}

    // apiTitle: 'Success Profile Dashboard Summary',
    @Get()
    async getDashboardSummary(@Query() query: SummaryQuery, @Req() request: Request): Promise<SummaryDashboardResponse> {
        return await this.service.getDashboardSummaryData(query, request);
    }
}
