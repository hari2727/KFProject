import { QueryProps } from '../../common/common.interface';

export interface PublishStatusQuery extends QueryProps.Default {
    pageIndex: string;
    pageSize: string;
    sortColumn: string;
    sortBy: string;
    locale: string;
    publishType: PublishType;
}

export interface RepublishPayload {
    itemModification: string;
}

export interface OptionsResponse {
    publishedRecords: Records[];
    paging: Paging;
}

export interface Records {
    id: number;
    publishedStatus: string;
    publishedDate: string;
    requester: Requester;
    successProfilesCount: number;
    competenciesDataCount: number;
    RequestPublishDate: string;
    publishType: string;
}

export interface Requester {
    uid: number;
    firstName: string;
    lastName: string;
    fullName: string;
}

export interface Paging {
    pageIndex: number;
    pageSize: number;
    totalPages: number;
    totalPublishedRecords: number;
}

export interface RawPublishStatus {
    ItemModificationID: number;
    ClientId: number;
    PersonId: number;
    FirstName: string;
    LastName: string;
    RequestPublishDate: string;
    PublishedDate: string;
    ProfileNumber: number;
    CompetencyNumber: number;
    PublishStatus: string;
    TotalPublishedRecords: number;
    PublishType: string;
}

export enum PublishType {
    BEHAVIOR_COMPETENCY  = 'BEHAVIOR_COMPETENCY',
    SKILLS = 'SKILLS',
    COMBINATION = 'BEHAVIOR_COMPETENCY|SKILLS'
}