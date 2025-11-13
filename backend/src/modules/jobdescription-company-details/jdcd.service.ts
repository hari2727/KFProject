import { Injectable } from '@nestjs/common';
import { JobDescriptionCompanyDetailsDataService } from './jdcd-data-service';
import {
    JobDescriptionCompanyCompanyDetailsDTO,
    JobDescriptionCompanyDetailsQuery,
    JobDescriptionCompanyDetailsResponse
} from './jdcd.types';
import { JobDescriptionCompanyDetails } from './jdcd.enum';
import { LogErrors } from '../../_shared/log/log-errors.decorator';

@Injectable()
export class JobDescriptionCompanyDetailsService {

    constructor(
        protected dataService: JobDescriptionCompanyDetailsDataService,
    ) {}

    @LogErrors()
    async getCompanyDetails(query: JobDescriptionCompanyDetailsQuery): Promise<JobDescriptionCompanyDetailsResponse> {
            if (query.outputType === JobDescriptionCompanyDetails.AboutCompany) {

                const response = await this.dataService.getCompanyDetailsDTOs({
                    clientId: query.loggedInUserClientId,
                    locale: query.locale,
                });

                for (const row of response || []) {
                    return this.getResponse(row);
                }
            }

            return this.getResponse({
                clientId: query.loggedInUserClientId,
                locale: query.locale,
                aboutCompany: null,
                applyToAllJobDescriptions: false
            });
    }

    protected getResponse(dto: JobDescriptionCompanyCompanyDetailsDTO): JobDescriptionCompanyDetailsResponse {
        return {
            companyDetails: {
                id: dto.clientId,
                name: null,
                description: null,
                aboutTheCompany: dto.aboutCompany,
            },
            applyToAllJobDescriptions: dto.applyToAllJobDescriptions,
        };
    }
}
