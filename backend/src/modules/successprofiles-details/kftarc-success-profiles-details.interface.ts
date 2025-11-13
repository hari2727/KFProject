import { Request } from 'express';
export namespace KfTarcSuccessProfileDetailsInterface {
    export interface HeadersWithAuthToken {
        authtoken: string;
        'ps-session-id': string;
        [ headerName: string ]: string;
    }
    export interface RequestWithAuthToken extends Request {
        headers: HeadersWithAuthToken;
    }

    export interface SuccessProfileGetDetailsRequest {
        spId: string;
        clientId: string;
    }

    export interface SuccessProfileDetailsRequest extends SuccessProfileGetDetailsRequest {
        job: object;
    }

    export interface SuccessProfileDetailsObjectResponse {
        hideJobInPM: number;
        id: number;
    }
}
