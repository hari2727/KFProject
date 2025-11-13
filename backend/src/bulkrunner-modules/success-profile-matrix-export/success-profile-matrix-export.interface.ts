import { AuthDetails } from '../../common/request-factory.interface';

export interface SuccessProfileMatrixExportRequestBody {
    userId: number;
    clientId: number;
    exportUrl: string;
    showShortProfile?: boolean;
    companyName: string;
    exportName?: string;
}

export interface SuccessProfileMatrixExportTaskGroupData {
    auth?: AuthDetails;
    userId: number;
    clientId: number;
    exportUrl: string;
    showShortProfile: boolean;
    companyName: string;
    totalTasks: number;
    exportName?: string;
}

export interface SuccessProfileMatrixExportTaskData {
}
