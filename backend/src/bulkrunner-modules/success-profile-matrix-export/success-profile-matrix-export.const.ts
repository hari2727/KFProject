import { TaskGroupConfig } from '../../bulkrunner/bulk-runner.interface';

export const getSuccessProfileMatrixExportTaskGroupConfig = (entriesCount: number): TaskGroupConfig => ({
    taskType: 'success_profile_matrix_export',
    taskTimeout: 10,
    taskGroupTimeToLive: 15,
    taskGroupPriority: Math.min(entriesCount, 100),
    taskGroupPolling: {
        intervals: (new Array(60).fill(1)).map(_ => 5000)
    }
});
