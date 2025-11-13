import { QueryProps } from '../../common/common.interface';
import { AppCode as ec } from '../../app.const';
import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';

export namespace KfTarcCertificationInterface {
    export interface HeadersWithAuthToken extends IncomingHttpHeaders {
        authtoken: string;
        'ps-session-id': string;
    }
    export interface RequestWithHeaders extends Request {
        headers: HeadersWithAuthToken;
    }
    export class DatabaseDTO {
        CertificateId: number;
        ClientID: string;
        ClientJobId: number;
        CertificateCode: string;
        CertificateTitle: string;
        CertificateDesc: string;
        CertificateOrder: number;
        HideSection: 0 | 1;
        MaxCode: number;
        IsDeleted?: 0 | 1;
        CreatedBy?: string;
        CreatedOn?: string;
        ModifiedBy?: string;
        ModifiedOn?: string;
    }
    export class RenamedDatabaseDTO {
        certificateId: number;
        clientID: string;
        clientJobId: number;
        code: string;
        name: string;
        description: string;
        order: number | null;
        hideSection: 0 | 1;
        maxCode: number;
        isDeleted?: 0 | 1;
        createdBy?: string;
        createdOn?: string;
        modifiedBy?: string;
        modifiedOn?: string;
    }
    export class DatabaseResponse {
        StatusCode: number;
        ExceptionCode: ec;
    }
    export class GetCertificatesQueryParams extends QueryProps.Default {
        clientJobId: number;
    }
    export interface FoundCertificate extends Omit<RenamedDatabaseDTO, 'hideSection' | 'maxCode'> {}
    export class GetCertificatesResponse {
        code: 'CERTTIFICATIONS';
        name: 'Licenses and Certifications';
        hideSection: boolean;
        hideNames: boolean;
        certs: FoundCertificate[];
    }
    export class PostCertificatesPayload {
        code?: string;
        name?: string;
        hideSection: boolean;
        hideNames?: boolean;
        certs: PostPayloadSinglCert[];
    }
    export class PostPayloadSinglCert {
        method?: Exclude<HttpMethodType, HttpMethodType.GET>;
        code?: string;
        name?: string;
        description?: string;
        order?: number;
    }
    export class PostCertificatesQueryParams extends QueryProps.Default {
        clientJobId: number;
    }
    export class SuccessProfilesPermissions {
        access: string;
        hasGradeAccess: boolean;
        hasMarketInsightsAccess: boolean;
        hasJobEvaluationAccess: boolean;
        hasEditJobEvaluationAccess: boolean;
        hasMarketInsightsSalaryDataAccess: boolean;
        hasEditSPAccess: boolean;
        hasOrgDemoGraphicAccess: boolean;
        hasExecutiveGradingAccess: boolean;
        hasCustomGrades: boolean;
        hasPayDataCollectionOrgSurveyAccess: boolean;
        hasPointValueAccess: boolean;
        hasExecutiveAccessByPointValue: boolean;
        pointValue?: number;
    }

    export enum HttpMethodType {
        POST = 'POST',
        GET = 'GET',
        DELETE = 'DELETE',
        PUT = 'PUT',
        NOT_SPECIFIED = 'NOT_SPECIFIED',
    }
}
