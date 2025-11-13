
export enum InterviewGuideTypes {
    MASTER = 'master',
    SPLIT = 'split',
    PDF = 'pdf',
    BehavioralCompetency = 'bc',
    Skills = 'skills'
}
export interface KfBCRecords {
    globalCode: string;
    name: string;
    id: number;
    selected: boolean;
}

export interface KfBCPage {
    searchTerm: string;
    bcCheckBox: boolean;
    skillCheckBox: boolean;
    records: KfBCRecords[];
}

export const buildURL = (...input: any[]): string =>
    input
        .join('/')
        .split('://')
        .map(s => s.replace(/\/+/g, '/'))
        .join('://');

export interface RecordLists {
    originalRecords: KfBCPage[];
    splitRecords: KfBCPage[];
}

export interface AllRecordLists {
    skills: RecordLists;
    bc: RecordLists;
}

export interface Item {
    label: string;
}

export interface Section {
    label: string;
    items: Item[];
}

export interface BehavioralComp {
    sections: Section[];
}

export interface split {
    counts: number;
}

export interface splitCounts {
    data: {
        splits: split[];
    };
}
export interface DownloadResponse {
    status: {
        code: string;
        message: string;
    };
    data: {
        statusCode: number;
        headers: {
            Location: string;
            Filename: string;
            FileKey: string;
            FileSize: number;
            Bucket: string;
            Region: string;
        };
    };
}
export interface RequestData {
    successProfileId: number;
    userId: number;
    clientId: number;
    locale: string;
    countryId: number;
    format: string;
    requestOnly: boolean;
    skillIds: number[];
    competencyIds: number[];
    exportName: string;
    fileName: string;
    refOnly: boolean;
}

