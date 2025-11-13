import { Request } from 'express';
export namespace KfTarcJobDescriptionsDetailsInterface {
    export interface HeadersWithAuthToken {
        authtoken: string;
        'ps-session-id': string;
        [ headerName: string ]: string;
    }

    export interface RequestWithAuthToken extends Request {
        headers: HeadersWithAuthToken;
    }

    export interface JobDescriptionsGetDetailsRequest {
        jdId: string;
        clientId: string;
    }

    export interface JobDescriptionsDetailsRequest extends JobDescriptionsGetDetailsRequest {
        job: object;
    }

    export interface JobDescriptionsDetailsObjectResponse {
        hideJobInPM: number;
        id: number;
    }
}
