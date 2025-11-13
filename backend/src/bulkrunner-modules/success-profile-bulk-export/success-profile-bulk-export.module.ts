import { Module } from '@nestjs/common';
import { BulkRunnerTaskGroupsDataService } from '../../bulkrunner/data/taskgroups-data.service';
import { S3Archiver } from '../../common/s3/s3archiver';
import { BulkRunnerRequestFactory } from '../../bulkrunner/bulk-runner-request-factory';
import { ExportCommonService } from '../export/export.service';
import { RequestCommon } from '../../common/common.utils';
import { BulkRunnerTasksDataService } from '../../bulkrunner/data/tasks-data.service';
import { SuccessProfileBulkExportService } from './success-profile-bulk-export.service';
import { SuccessProfileBulkExportController } from './success-profile-bulk-export.controller';

@Module({
    providers: [
        BulkRunnerRequestFactory,
        BulkRunnerTaskGroupsDataService,
        BulkRunnerTasksDataService,
        SuccessProfileBulkExportService,
        ExportCommonService,
        S3Archiver,
        RequestCommon,
    ],
    controllers: [
        SuccessProfileBulkExportController,
    ],
})
export class SuccessProfileBulkExportModule {}
