import { AxiosRequestConfig } from 'axios';

export interface ResponseStatus {
    code: string;
    message: string;
}

export interface Response<T = void> {
    success: boolean;
    status: ResponseStatus;
    data?: T;
}

export interface Headers {
    [key: string]: string;
}

export interface AuthHeaders extends Headers {
    authtoken: string;
    'ps-session-id': string;
}

export interface LambdaAuthHeaders extends Headers {
    Authtoken: string;
    'Ps-session-id': string;
}

export interface AuthQueryParams {
    authToken: string;
    'ps-session-id': string;
}

export interface AuthDetails {
    authToken: string;
    sessionId: string;
}

export interface RequestOptions {
    auth: AuthDetails;
}

export interface CallbackRequest<T extends AxiosRequestConfig = any> {
    callback: T;
}

export interface CallbackCallbackRequest<T extends AxiosRequestConfig = any> {
    callback?: AxiosRequestConfig<CallbackRequest<T>>;
}

export interface DownloadSuccessProfileRequestOptions extends RequestOptions {
    id: number;
    clientId?: number;
    userId?: number;
    locale?: string;
    countryId?: string;
    hideLevels?: number;
    excludeSections?: number[];
    exportName?: string;
}

export interface DownloadInterviewGuideRequestOptions extends RequestOptions {
    successProfileId: number;
    countryId?: number;
    clientId?: number;
    userId?: number;
    userLocale?: string;
    locale?: string;
    skillIds?: number[];
    competencyIds?: number[];
    format?: string;
    fileName?: string;
}

export interface DownloadSuccessProfileCallbackRequestOptions extends DownloadSuccessProfileRequestOptions {
    callback: AxiosRequestConfig;
}

export interface DownloadInterviewGuideCallbackRequestOptions extends DownloadInterviewGuideRequestOptions {
    callback: AxiosRequestConfig;
}

export interface DownloadSuccessProfileRequest extends AuthQueryParams {
    spId: number;
    clientId?: number;
    locale?: string;
    countryId?: string;
    hideLevels?: number;
    excludeSections?: string;
    refOnly: number;
}

export interface DownloadSuccessProfileCallbackRequest extends CallbackCallbackRequest {
    spId: string;
    clientId?: string;
    userId?: string;
    locale?: string;
    countryId?: string;
    hideLevels?: string;
    excludeSections?: string;
    fileName?: string;
    refOnly: string;
}

export interface DownloadInterviewGuideCallbackRequest extends CallbackCallbackRequest {
    successProfileId: number;
    clientId: number;
    userId: number;
    countryId: number;
    userLocale: string;
    locale: string;
    skillIds: number[];
    competencyIds: number[];
    format: string;
    fileName: string;
    refOnly: string;
}

export interface DownloadJobDescriptionRequestOptions extends RequestOptions {
    id: number;
    format: string;
    clientId?: number;
    userId?: number;
    locale?: string;
    countryId?: string;
    exportName?: string;
}

export interface DownloadJobDescriptionCallbackRequestOptions extends DownloadJobDescriptionRequestOptions {
    callback: AxiosRequestConfig;
}

export interface DownloadJobDescriptionRequest extends AuthQueryParams {
    jobId: number;
    format: string;
    clientId?: number;
    locale?: string;
    countryId?: string;
    refOnly: number;
}

export interface DownloadJobDescriptionCallbackRequest extends CallbackCallbackRequest {
    jobId: string;
    format: string;
    clientId?: string;
    userId?: string;
    locale?: string;
    countryId?: string;
    fileName?: string;
    refOnly: string;
}

export interface SuccessProfilesMatrixViewExportRequestOptions extends RequestOptions {
    clientId: number;
    userId: number;
    exportUrl: string;
    showShortProfile: boolean;
    companyName: string;
    callback?: AxiosRequestConfig;
}

export interface SuccessProfilesMatrixViewExportRequest extends CallbackCallbackRequest {
    clientId: number;
    userId: number;
    exportUrl: string;
    showShortProfile: boolean;
    companyName: string;
    refOnly?: boolean;
}
