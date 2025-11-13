
// level | function | task | custom
export type ProfileTypes = 'LEVELS' | 'BEST_IN_CLASS' | 'O_NET' | 'CUSTOM_PROFILE' | 'AI_PROFILE';

export interface DownloadsData {
    id: number;
    reportType: string;
    title: string;
}

interface DescriptionBase {
    effectiveDateTime: number;
    familyName: string;
    firstName: string;
    id: number;
    lastName: string;
    managementLabel: string;
    profileType: ProfileTypes;
    subFamilyName: string;
    title: string;
    userId: number;
}

export interface JobDescription extends DescriptionBase {
    jobExportUrl: string;
}

export interface SPDescription extends DescriptionBase {
    noOfDependantJobs: number;
    parentJobDetails?: {
        id: number;
        title: string;
        version: number;
    };
}

export interface KfTarcSummary {
    level: {
        totalResultRecords: number;
        levels: {
            id: number;
            name: string;
            value: number;
        }[];
    };
    functions: {
        id: string;
        name: string;
        value: any;
    }[];
    jobdescriptions: {
        totalResultRecords: number;
        jobs: JobDescription[];
    };
    successProfiles: {
        totalResultRecords: number;
        jobs: SPDescription[];
    };
    downloads: DownloadsData[];
}
