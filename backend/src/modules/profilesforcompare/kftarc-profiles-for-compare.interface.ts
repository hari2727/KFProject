import { QueryProps } from '../../common/common.interface';

export interface ProfileCompareQuery extends QueryProps.Default {
    type: string;
    jobRoleTypeId: string;
    jobRoleName: string;
    inputType: string;
}

export interface ProfileMatchAndCompareDBResponse {
    ClientJobID: number;
    JobName: string;
    HayReferenceLevel: number;
    ShortProfile: string;
    KFManagementName: string;
    LevelType: string;
}

export interface ProfileMatchAndCompareResponse {
    id: string;
    title: string;
    standardHayGrade: string;
    shortProfile: string;
    levelName: string;
    profileType: string;
}
export interface ProfileCollectionIdDBResponse{
    ProfileCollectionID: number;
}

export const SEARCH_JOBS_MY_DESCRIPTIONS = 'SEARCH_JOBS_MY_DESCRIPTIONS';

export enum DELIMITER{
    COMMA=','
};
