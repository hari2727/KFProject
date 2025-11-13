import { TaskGroupConfig } from '../../bulkrunner/bulk-runner.interface';

export const getSuccessProfileSingleExportTaskGroupConfig = (entriesCount: number): TaskGroupConfig => ({
    taskType: 'success_profile_single_pdf_export',
    taskTimeout: 2,
    taskGroupTimeToLive: 15,
    taskGroupPriority: Math.min(entriesCount, 100),
    taskGroupPolling: {
        intervals: (new Array(60).fill(1)).map(_ => 3000)
    }
});
