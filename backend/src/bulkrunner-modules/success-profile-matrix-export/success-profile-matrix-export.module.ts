import { Module } from '@nestjs/common';
import { BulkRunnerRequestFactory } from '../../bulkrunner/bulk-runner-request-factory';
import { BulkRunnerTaskGroupsDataService } from '../../bulkrunner/data/taskgroups-data.service';
import { BulkRunnerTasksDataService } from '../../bulkrunner/data/tasks-data.service';
import { ExportCommonService } from '../export/export.service';
import { SuccessProfileMatrixExportService } from './success-profile-matrix-export.service';
import { SuccessProfileMatrixExportController } from './success-profile-matrix-export.controller';

@Module({
    providers: [
        BulkRunnerRequestFactory,
        BulkRunnerTaskGroupsDataService,
        BulkRunnerTasksDataService,
        ExportCommonService,
        SuccessProfileMatrixExportService,
    ],
    controllers: [
        SuccessProfileMatrixExportController,
    ],
})
export class SuccessProfileMatrixExportModule {}
