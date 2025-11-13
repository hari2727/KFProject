import { TaskStatus } from '../../bulkrunner/bulk-runner.const';
import { ClientTaskGroupUpdateCallbackPayload } from '../../bulkrunner/bulk-runner.interface';
import { ActivityCallbackRequestConfig } from '../../bulkrunner/bulk-runner.interface';

export interface SuccessProfileBulkExportRequestBody {
    userId: number;
    clientId: number;
    locale?: string;
    countryId?: string;
    excludeSections?: number[];
    hideLevels?: number;
    exportName?: string;
    ids: {
        [exportEntityType: string]: number[];
    };
}

export interface SuccessProfileBulkExportTaskGroupResult {
    completed: SuccessProfileBulkExportCompletedTaskResult[];
    failed: SuccessProfileBulkExportFailedTaskResult[];
    archives?: SuccessProfileBulkExportArchiveEntry[];
    error?: any;
}

export interface SuccessProfileBulkExportFailedTaskResult {
    id: number;
    status: TaskStatus;
    error: any;
}

export interface SuccessProfileBulkExportCompletedTaskResult {
    id: number;
    status: TaskStatus;
    location?: string;
    filename?: string;
    filekey?: string;
    filesize?: number;
    bucket?: string;
    region?: string;
}

export interface SuccessProfileBulkExportArchiveEntry {
    id: string;
    bucket: string;
    filekey: string;
    filesize?: number;
    region: string;
    status: TaskStatus;
}

export interface SuccessProfileBulkExportTaskGroupResultPayload extends ClientTaskGroupUpdateCallbackPayload<SuccessProfileBulkExportTaskGroupResult> {
}

export interface UpdateTaskGroupResultRequest {
    status: number;
    targetRegion: string;
    targetBucket: string;
    targetFileKey: string;
    targetFileSize?: number;
    transitData: UpdateTaskGroupResultTransitData;
}

export interface UpdateTaskGroupResultTransitData {
    groupId: number;
    finalCallback: ActivityCallbackRequestConfig;
    filesHash: string;
}
