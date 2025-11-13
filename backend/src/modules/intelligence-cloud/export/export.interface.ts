import { OutputType, ExportType, OutputStructureFormat, ExportOutputLocation } from './export.const';

export interface ExportRequestBody {
    clientId: number;
    locale: string;
    guid?: string;
    jobId?: number;
    format?: ExportType;
    version?: OutputStructureFormat;
    output?: OutputType;
    target?: ExportOutputLocation;
}

export interface ExportQueryParams extends ExportRequestBody {
}

export interface ExportOutputLocationConfig {
    url: string;
    subscriptionKey?: string;
}

export interface PageDataConfig {
    pageName: string;
    storedProcedureName?: string;
    data?: PageDataResponse;
}

export interface PageDataResponse extends Array<PageData> {
    columns: PageColumns;
}
export interface PageData {
    [key: string]: any;
}

export interface PageColumns {
    [key: string]: any;
}
