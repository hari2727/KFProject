import { Module } from '@nestjs/common';
import { BulkRunnerRequestFactory } from '../../bulkrunner/bulk-runner-request-factory';
import { BulkRunnerTaskGroupsDataService } from '../../bulkrunner/data/taskgroups-data.service';
import { BulkRunnerTasksDataService } from '../../bulkrunner/data/tasks-data.service';
import { ExportCommonService } from '../export/export.service';
import { InterviewGuideSingleExportController } from './interviewguide-single-export.controller';
import { InterviewGuideSingleExportService } from './interviewguide-single-export.service';

@Module({
    providers: [
        BulkRunnerRequestFactory,
        BulkRunnerTaskGroupsDataService,
        BulkRunnerTasksDataService,
        ExportCommonService,
        InterviewGuideSingleExportService,
    ],
    controllers: [
        InterviewGuideSingleExportController,
    ],
})
export class InterviewGuideSingleExportModule {}
