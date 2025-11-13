import { Module } from '@nestjs/common';
import { SuccessProfileSummaryController } from './summary.controller';
import { SuccessProfileDashboardSummaryService } from './summary.service';
import { DashboarSummaryDataServiceToken } from './summary.tokens';
import { SummaryDataService } from './summary.sql.data.service';
import { KfTarcRolesService } from '../roles/kftarc-roles.service';
import { BulkRunnerRequestFactory } from '../../bulkrunner/bulk-runner-request-factory';
import { RequestCommon } from '../../common/common.utils';
import { RequestFactory } from '../../common/request-factory';

@Module({
    providers: [
        SuccessProfileDashboardSummaryService,
        RequestCommon,
        RequestFactory,
        KfTarcRolesService,
        BulkRunnerRequestFactory,
        {
            provide: DashboarSummaryDataServiceToken,
            useClass: SummaryDataService,
        },
    ],
    controllers: [
        SuccessProfileSummaryController,
    ],
})
export class DashboardSummaryModule {}
