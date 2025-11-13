import { TaskStatus } from '../../bulkrunner/bulk-runner.const';
import { ActivityCallbackRequestConfig } from '../../bulkrunner/bulk-runner.interface';

export interface SingleExportTaskGroupResult {
    status: TaskStatus;
    data?: {
        location?: string;
        filename?: string;
        filekey?: string;
        filesize?: number;
        bucket?: string;
        region?: string;
    };
    error?: any;
}

export interface DetailedExportTaskResult {
    id: number;
    status: TaskStatus;
    data?: {
        location?: string;
        filename?: string;
        filekey?: string;
        filesize?: number;
        bucket?: string;
        region?: string;
    },
    error?: any;
}

export interface ExportTaskResult {
    location?: string;
    filename?: string;
    filekey?: string;
    filesize?: number;
    bucket?: string;
    region?: string;
    error?: string;
}

export interface ExportLambdaResponse {
    headers: {
        Location?: string;
        Filename?: string;
        FileKey?: string;
        FileSize?: number;
        Bucket?: string;
        Region?: string;
    };
}

export interface ExportUpdateTaskResultRequestBody {
    callback: ActivityCallbackRequestConfig;
    results: ExportCallbackResults;
}

export interface ExportCallbackResults {
    Location?: string;
    Filename?: string;
    FileKey?: string;
    FileSize?: number;
    Bucket?: string;
    Region?: string;
}
