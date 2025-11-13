import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig, Method } from 'axios';
import {
    AuthDetails,
    AuthHeaders,
    AuthQueryParams,
    DownloadInterviewGuideCallbackRequest,
    DownloadInterviewGuideCallbackRequestOptions,
    DownloadJobDescriptionCallbackRequest,
    DownloadJobDescriptionCallbackRequestOptions,
    DownloadJobDescriptionRequest,
    DownloadJobDescriptionRequestOptions,
    DownloadSuccessProfileCallbackRequest,
    DownloadSuccessProfileCallbackRequestOptions,
    DownloadSuccessProfileRequest,
    DownloadSuccessProfileRequestOptions,
    Headers,
    LambdaAuthHeaders,
    SuccessProfilesMatrixViewExportRequest,
    SuccessProfilesMatrixViewExportRequestOptions,
} from './request-factory.interface';
import { Request } from 'express';
import { RequestFactoryBase } from './request-factory.base';
import { ConfigService } from '../_shared/config/config.service';

@Injectable()
export class RequestFactory extends RequestFactoryBase {

    protected appName: string;
    protected tarcApiBase: string;
    protected tarcReportApiBase: string;
    protected reportApiBase: string;
    readonly tarcLambdaApiBase: string;

    constructor(
        protected configService: ConfigService,
    ) {
        super();
        this.appName = this.configService.get('APP_NAME');
        this.tarcApiBase = this.configService.get('URL_KFHUB_TARC_API_BASE');
        this.tarcReportApiBase = this.configService.get('URL_KFHUB_TARC_REPORT_API_BASE');
        this.reportApiBase = this.configService.get('URL_KFHUB_REPORT_API_BASE');
        this.tarcLambdaApiBase = this.configService.get('URL_KFHUB_TARC_LAMBDA_API_BASE');
    }

    buildLocalURL(...input: any[]): string {
        return this.buildURL(this.tarcApiBase, ...input);
    }

    getAuthDetails(request: Request): AuthDetails {
        const authToken = request.headers['authtoken'] as string;
        if (!authToken) {
            this.throwError('"authToken" is not provided');
        }

        const sessionId = request.headers['ps-session-id'] as string;
        if (!sessionId) {
            this.throwError('"ps-session-id" header is not provided');
        }

        return { authToken, sessionId };
    }

    generateAuthHeaders(options: AuthDetails): AuthHeaders {
        return {
            authtoken: options.authToken,
            'ps-session-id': options.sessionId,
        };
    }

    generateLambdaAuthHeaders(options: AuthDetails): LambdaAuthHeaders {
        return {
            'Authtoken': options.authToken,
            'Ps-session-id': options.sessionId,
        };
    }

    generateApplicationHeaders(): Headers {
        return {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'application': this.appName,
        };
    }

    generateLambdaRequestHeaders(auth: AuthDetails): Headers {
        return {
            ...this.generateApplicationHeaders(),
            ...this.generateLambdaAuthHeaders(auth),
            'Content-Type': 'application/json'
        };
    }

    generateAuthQueryParams(options: AuthDetails): AuthQueryParams {
        return {
            authToken: options.authToken,
            'ps-session-id': options.sessionId,
        };
    }

    getDownloadSuccessProfileRequest(options: DownloadSuccessProfileRequestOptions): AxiosRequestConfig {
        const query = this.buildRequestQuery({
            spId: options.id,
            clientId: options.clientId,
            locale: options.locale,
            countryId: options.countryId,
            hideLevels: options.hideLevels,
            excludeSections: options.excludeSections ? options.excludeSections.join(',') : undefined,
            refOnly: 1,
            ...this.generateAuthQueryParams(options.auth),
        } as DownloadSuccessProfileRequest);
        const url = this.buildURL(this.tarcReportApiBase, '/download/sucessprofile');
        return {
            method: 'GET',
            url: this.pushQueryParams(url, query),
            headers: {
                ...this.generateApplicationHeaders(),
                ...this.generateLambdaAuthHeaders(options.auth),
            },
        };
    }

    getDownloadSuccessProfileCallbackRequest(options: DownloadSuccessProfileCallbackRequestOptions): AxiosRequestConfig {
        const payload = this.filterEmpty<DownloadSuccessProfileCallbackRequest>({
            spId: String(options.id),
            clientId: options.clientId ? String(options.clientId) : undefined,
            userId: options.userId ? String(options.userId) : undefined,
            locale: options.locale,
            countryId: options.countryId,
            hideLevels: options.hideLevels ? String(options.hideLevels): undefined,
            excludeSections: options.excludeSections ? options.excludeSections.join(',') : undefined,
            callback: options.callback,
            fileName: options.exportName || undefined,
            refOnly: String(1),
        });
        return {
            method: 'POST',
            url: this.buildURL(this.tarcReportApiBase, '/download/sucessprofile'),
            data: this.buildRequestBody(payload),
            headers: this.generateLambdaRequestHeaders(options.auth),
        };
    }

    getDownloadInterviewGuideCallbackRequest(options: DownloadInterviewGuideCallbackRequestOptions): AxiosRequestConfig {
        const payload = this.filterEmpty<DownloadInterviewGuideCallbackRequest>({
            successProfileId: options.successProfileId,
            clientId: options.clientId || undefined,
            userId: options.userId || undefined,
            countryId: options.countryId,
            userLocale: options.userLocale,
            locale: options.locale,
            skillIds: options.skillIds,
            competencyIds: options.competencyIds,
            format: options.format,
            callback: options.callback,
            fileName: options.fileName,
            refOnly: String(1),
        });
        return {
            method: 'POST',
            url: this.buildURL(this.tarcReportApiBase, '/download/interviewguide'),
            data: this.buildRequestBody(payload),
            headers: this.generateLambdaRequestHeaders(options.auth),
        };
    }

    getDownloadJobDescriptionRequest(options: DownloadJobDescriptionRequestOptions): AxiosRequestConfig {
        const query = this.buildRequestQuery({
            jobId: options.id,
            format: options.format,
            clientId: options.clientId,
            locale: options.locale,
            countryId: options.countryId,
            refOnly: 1,
            ...this.generateAuthQueryParams(options.auth),
        } as DownloadJobDescriptionRequest);
        const url = this.buildURL(this.tarcReportApiBase, '/download/jobdescription');
        return {
            method: 'GET',
            url: this.pushQueryParams(url, query),
            headers: {
                ...this.generateApplicationHeaders(),
                ...this.generateLambdaAuthHeaders(options.auth),
            },
        };
    }

    getDownloadJobDescriptionCallbackRequest(options: DownloadJobDescriptionCallbackRequestOptions): AxiosRequestConfig {
        const payload = this.filterEmpty<DownloadJobDescriptionCallbackRequest>({
            jobId: String(options.id),
            format: options.format,
            clientId: options.clientId ? String(options.clientId) : undefined,
            userId: options.userId ? String(options.userId) : undefined,
            locale: options.locale,
            countryId: options.countryId,
            callback: options.callback,
            fileName: options.exportName || undefined,
            refOnly: String(1),
        });
        return {
            method: 'POST',
            url: this.buildURL(this.tarcReportApiBase, '/download/jobdescription'),
            data: this.buildRequestBody(payload),
            headers: this.generateLambdaRequestHeaders(options.auth),
        };
    }

    getSuccessProfilesMatrixViewExportRequest(options: SuccessProfilesMatrixViewExportRequestOptions): AxiosRequestConfig<SuccessProfilesMatrixViewExportRequest> {
        const payload = this.filterEmpty<SuccessProfilesMatrixViewExportRequest>({
            clientId: Number(options.clientId),
            userId: Number(options.userId),
            exportUrl: options.exportUrl,
            showShortProfile: options.showShortProfile,
            companyName: options.companyName,
            refOnly: true,
            callback: options.callback,
        });
        //@TODO replace similar occurences with
        // return this.generateLambdaRequest('POST', this.reportApiBase, '/export', payload, options.auth);
        return {
            method: 'POST',
            url: this.buildURL(this.reportApiBase, '/export'),
            data: this.buildRequestBody(payload),
            headers: this.generateLambdaRequestHeaders(options.auth),
        };
    }

    generateLambdaRequest<D>(method: Method, apiBase: string, url: string, body: D, request: Request, additHeaders?: { [key: string]: string }, isPayloadABuffer = false) {
        const auth = this.getAuthDetails(request);
        const payload = isPayloadABuffer ? { body, isBase64Encoded: true } : body;
        const headers = Object.assign({}, this.generateLambdaRequestHeaders(auth), additHeaders);
        return {
            method,
            url: this.buildURL(apiBase, url),
            data: this.buildRequestBody(payload),
            headers,
        };
    }
}
