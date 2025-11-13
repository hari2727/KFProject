import { TaskGroupConfig } from '../../bulkrunner/bulk-runner.interface';

export const archiveSize = 200;

export const getSuccessProfileBulkExportTaskGroupConfig = (entriesCount: number): TaskGroupConfig => ({
    taskType: 'success_profile_bulk_pdf_export',
    taskTimeout: 2,
    taskGroupTimeToLive: 15,
    taskGroupPriority: Math.min(entriesCount, 100),
});

export const maxSuccessProfileBulkExportRetries = 3;
