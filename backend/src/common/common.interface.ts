import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { options } from './common.utils';
import { IncomingMessage } from 'http';
import { toNumber } from '../_shared/convert';

export namespace QueryProps {
    export class Default {
        @Transform(({ value }) => toNumber(value), options)
        loggedInUserClientId: number;

        @Transform(({ value }) => toNumber(value), options)
        userId: number;

        @IsString()
        locale: string;
    }
    export class FileUuid {
        @IsString()
        fileUUID: string;
    }
}

export interface KfHeaders extends Partial<IncomingMessage> {
    authtoken: string;
    'ps-session-id': string;
}

export interface KfRestrictions {
    isExec: number;
    pointValue: any;
}

export interface KfPermissions {
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

export interface SearchPaging {
    pageIndex: number;
    pageSize: number;
    totalPages: number;
    totalResultRecords: number;
}

export interface SearchPagingResponse {
    paging: SearchPaging;
}

export type DefaultQuery = QueryProps.Default;

export type OverriddenClientQuery = DefaultQuery & {
    preferredClientId?: string;
    preferredLocale?: string;
};
