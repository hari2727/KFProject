import { SuccessProfileExportEntityFormat, SuccessProfileExportEntityType } from './success-profile.export.const';
import { AuthDetails } from '../../common/request-factory.interface';

export interface SuccessProfileExportTaskGroupData {
    auth?: AuthDetails;
    userId: number;
    clientId: number;
    locale?: string;
    countryId?: string;
    hideLevels?: number;
    excludeSections?: number[];
    totalTasks: number;
    exportName?: string;
    retriesLeft?: number;
}

export interface SuccessProfileExportTaskData {
    id: number;
    type: SuccessProfileExportEntityType;
    format: SuccessProfileExportEntityFormat;
}
