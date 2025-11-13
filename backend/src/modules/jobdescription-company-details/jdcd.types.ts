import { DefaultQuery } from "../../common/common.interface";

export interface JobDescriptionCompanyDetailsResponse {
    companyDetails: CompanyDetails;
    applyToAllJobDescriptions: boolean;
}

export interface JobDescriptionCompanyDetailsQuery extends DefaultQuery {
    outputType?: string;
}

export interface GetJobDescriptionCompanyCompanyDetailsOptions {
    clientId: number;
    locale: string;
}

export interface JobDescriptionCompanyCompanyDetailsDTO {
    clientId: number;
    locale: string | null;
    aboutCompany: string | null;
    applyToAllJobDescriptions: boolean;
}

export interface CompanyDetails {
    id: number;
    name: string | null;
    description: string | null;
    aboutTheCompany: string | null;
}
