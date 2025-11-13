import { SuccessProfileExportEntityFormat, SuccessProfileExportEntityType } from '../export/success-profile.export.const';

export interface SuccessProfileSingleExportRequestBody {
    id: number;
    type: SuccessProfileExportEntityType;
    userId: number;
    clientId: number;
    locale?: string;
    countryId?: string;
    hideLevels?: number;
    format?: SuccessProfileExportEntityFormat;
    excludeSections?: number[];
    exportName?: string;
}
