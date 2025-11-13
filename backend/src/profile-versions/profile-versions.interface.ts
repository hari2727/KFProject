import { QueryProps } from '../common/common.interface';

export interface ProfileVersionsQuery extends QueryProps.Default {
    successProfileId: number;
}

export interface ProfileVersionsRawResponse {
    ClientJobID: number;
    VersionNo: string;
    OrderNo: number;
}

export interface ProfileVersionsResponse {
    jobId: number;
    version: string;
    order: number;
}
