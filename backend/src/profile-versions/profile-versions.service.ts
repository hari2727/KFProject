import { BadRequestException, Injectable } from '@nestjs/common';
import { ProfileVersionsRepository } from './profile-versions.repository';
import {
    ProfileVersionsQuery,
    ProfileVersionsRawResponse,
    ProfileVersionsResponse
} from './profile-versions.interface';
import { LogErrors } from '../_shared/log/log-errors.decorator';

@Injectable()
export class ProfileVersionsService {

    constructor(protected profileVersionsRepo: ProfileVersionsRepository){}

    @LogErrors()
    async getProfileVersionDetails(query: ProfileVersionsQuery): Promise<ProfileVersionsResponse[]> {
            if(!query?.successProfileId || isNaN(query.successProfileId)){
                throw new BadRequestException(`SuccessProfileId is required`);
            } else {
                const dbRawResponse = await this.profileVersionsRepo.getProfileVersionDetails(query);
                return this.mapResponseData(dbRawResponse)
            }
    }

    protected mapResponseData(dbRawResponse: ProfileVersionsRawResponse[]): ProfileVersionsResponse[] {
        return (dbRawResponse || []).map(item => ({
            jobId: +item.ClientJobID,
            version: item.VersionNo,
            order: +item.OrderNo
        }));
    }
}
