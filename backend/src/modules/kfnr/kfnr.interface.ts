import { KfTarcSuccessProfileDetailsInterface } from '../successprofiles-details/kftarc-success-profiles-details.interface';

export namespace GetSpId {
    export class QueryParams {
        bicCode: string;
        versionNo: string;
    }
    export class Response {
        spId: number;
    }
}

export interface ClientJobIdResponse {
    clientJobId: number;
}
export class GetClientJobIdQueryParams {
    jobCode: string;
    grade: string;
}

export interface SuccessProfileDetailRequest extends KfTarcSuccessProfileDetailsInterface.RequestWithAuthToken {}
