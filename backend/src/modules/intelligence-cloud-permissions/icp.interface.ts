import { QueryProps } from '../../common/common.interface';

export interface GetIntelligenceCloudPermissionsRequest extends QueryProps.Default {
    clientId?: string;
}

export interface IntelligenceCloudPermissions {
    isICClient: boolean;
}

export interface IntelligenceCloudPermissionsDBResponse {
    IsICClient: boolean;
}
