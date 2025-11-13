import { IsNumber, IsDefined } from 'class-validator';
import { ObjectLiteral } from 'typeorm';

export namespace KfTarcPMJobsVisibilityStatusInterface {
    export class StatusDTO {
        @IsNumber()
        @IsDefined()
        status: number;
    }

    export class QueryDataBaseResponse {
        @IsNumber()
        @IsDefined()
        HideStatus: number;
    }

    export enum MutationExceptionCodes {
        SUCCESS = 'RES.20000',
        ERROR = 'RES.20299',
    }

    export class MutationDataBaseResponse {
        @IsNumber()
        @IsDefined()
        StatusCode: number;

        @IsDefined()
        ExceptionCode: MutationExceptionCodes;
    }

    export enum QueryObjectType {
        QUERY = 'QUERY',
        MUTATION = 'MUTATION',
    }

    export interface QueryObject {
        paramsObj: ObjectLiteral;
        queryString: string;
    }
}
