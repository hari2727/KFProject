import { QueryProps } from "../../common/common.interface";

export interface GetJobPropertiesQuery extends QueryProps.Default {
    clientId?: string;
}

export interface JobPropertiesListResponse {
    responseCode:    string;
    responseMessage: string;
    data:            JobPropertiesListData;
}

export interface JobPropertiesListData {
    status:        JobPropertiesStatusEnum;
    jobProperties: JobProperty[];
}

export interface JobPropertiesByIDResponse {
    responseCode:    string;
    responseMessage: string;
    data:            JobPropertiesByIDData;
}

export interface JobPropertiesByIDData {
    jobProperties: JobProperty[];
}


export interface PublishJobPropertiesResponse {
    responseCode:    string;
    responseMessage: string;
}
export interface JobPropertyQueryResponse {
    JobPropertyID:        number;
    JobPropertyName:      string;
    DisplayJobProperty:   number;
    IsRequired:           number;
    IsMultiSelected:      number;
    JobPropertyValueID:   number | string;
    JobPropertyValueName: string;
    JobPropertyCode:      string;
    JobCount:             number;
    PropDisplayOrder:     number;
    SubPropDisplayOrder:  number;
}

export enum JobPropertiesStatusEnum {
    PUBLISHED = "PUBLISHED",
    MODIFIED = "MODIFIED"
}
export interface JobProperty {
    id: number;
    name: string;
    isActive: boolean;
    isRequired: boolean;
    isMultiSelected: boolean;
    isDeleted?: boolean;
    code: string;
    displayOrder: number;
    props?: SubProperty[];
}

export interface SubProperty {
    jobPropertyId?: number;
    id: number | string;
    name: string;
    noOfSuccessProfiles: number;
    displayOrder: number;
    isActive?: boolean;
}

export interface JobPropertyResponse {
    jobProperties: JobProperty[];
}

export interface JobPropertiesStatus {
    Modification: JobPropertiesStatusEnum;
}
export interface JobPropertyRequest {
    jobProperties: JobProperty[];
}

export interface QueryParams extends QueryProps.Default {}

export type JobPropertyValueMap = {
    [JobPropertyKeys.UPDATE_JOB_PROPERTIES]: JobProperty[];
    [JobPropertyKeys.INSERT_SUB_PROPERTIES]: SubProperty[];
    [JobPropertyKeys.UPDATE_SUB_PROPERTIES]: SubProperty[];
};

export enum JobPropertyKeys {
    UPDATE_JOB_PROPERTIES = 'UpdateJobProperties',
    INSERT_SUB_PROPERTIES = 'InsertSubProperties',
    UPDATE_SUB_PROPERTIES = 'UpdateSubProperties',
    JOB_PROPERTIES_TYPE = 'JOB_PROPERTIES',
}
