import { Module } from '@nestjs/common';
import { BulkRunnerRequestFactory } from '../../bulkrunner/bulk-runner-request-factory';
import { BulkRunnerTaskGroupsDataService } from '../../bulkrunner/data/taskgroups-data.service';
import { BulkRunnerTasksDataService } from '../../bulkrunner/data/tasks-data.service';
import { ExportCommonService } from '../export/export.service';
import { SuccessProfileSingleExportController } from './success-profile-single-export.controller';
import { SuccessProfileSingleExportService } from './success-profile-single-export.service';

@Module({
    providers: [
        BulkRunnerRequestFactory,
        BulkRunnerTaskGroupsDataService,
        BulkRunnerTasksDataService,
        ExportCommonService,
        SuccessProfileSingleExportService,
    ],
    controllers: [
        SuccessProfileSingleExportController,
    ],
})
export class SuccessProfileSingleExportModule {}
