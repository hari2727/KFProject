import { TaskGroupConfig } from '../../bulkrunner/bulk-runner.interface';

export const getInterviewGuideSingleExportTaskGroupConfig = (entriesCount: number): TaskGroupConfig => ({
    taskType: 'ig_single_export',
    taskTimeout: 2,
    taskGroupTimeToLive: 15,
    taskGroupPriority: Math.min(entriesCount, 100),
    taskGroupPolling: {
        intervals: (new Array(60).fill(1)).map(_ => 3000)
    }
});
