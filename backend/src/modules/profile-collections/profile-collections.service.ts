import { BadRequestException, Injectable } from '@nestjs/common';

import { ProfileCollectionsRepository } from './profile-collections.repository';
import { ProfileCollectionsRawResponse, ProfileCollectionsResponse } from './profile-collections.interface';
import { QueryProps } from '../../common/common.interface';

@Injectable()
export class ProfileCollectionsService {
    constructor(protected repository: ProfileCollectionsRepository) {}

    async getProfileCollections(query: QueryProps.Default): Promise<ProfileCollectionsResponse[]> {
        this.validateQueryParams(query);
        const rawResponse: ProfileCollectionsRawResponse[] = await this.repository.getProfileCollections(query.loggedInUserClientId, query.userId);
        return this.mapResponse(rawResponse);
    }

    protected mapResponse(data: ProfileCollectionsRawResponse[]): ProfileCollectionsResponse[] {
        return (data || []).map((item: ProfileCollectionsRawResponse) => ({
            profileCollectionId: item.ProfileCollectionID,
            profileCollectionsName: item.ProfileCollectionsName,
        }));
    }

    protected validateQueryParams(query: QueryProps.Default) {
        const { userId, loggedInUserClientId } = query;
        const regExp = /^[0-9]+$/;
        if (!(regExp.test(userId.toString()) && regExp.test(loggedInUserClientId.toString()))) {
            throw new BadRequestException('Invalid client id or userId');
        }
        return true;
    }
}
