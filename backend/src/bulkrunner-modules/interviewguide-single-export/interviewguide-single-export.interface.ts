import { AuthDetails } from '../../common/request-factory.interface';
import { getInterviewGuideSingleExportTaskGroupConfig } from './interviewguide-single-export.const';

export enum InterviewGuideExportEntityFormat {
    PDF = 'pdf',
    DOC = 'doc',
}

export interface InterviewGuideSingleExportRequestBody {
    successProfileId: number;
    countryId: number;
    clientId: number;
    userId: number;
    locale: string;
    skillIds?: number[];
    competencyIds?: number[];
    format: InterviewGuideExportEntityFormat;
    fileName?: string;
}

export interface InterviewGuideSingleExportTaskGroupData {
    auth?: AuthDetails;
    successProfileId: number;
    countryId: number;
    clientId: number;
    userId: number;
    userLocale: string;
    locale: string;
    skillIds?: number[];
    competencyIds?: number[];
    format: InterviewGuideExportEntityFormat;
    fileName?: string;
    totalTasks: number;
    retriesLeft?: number;
}

export interface InterviewGuideSingleExportTaskData {
    successProfileId: number;
    format: InterviewGuideExportEntityFormat;
}
