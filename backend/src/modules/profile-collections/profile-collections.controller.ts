import { Controller, Get, Query } from '@nestjs/common';
import { QueryProps } from '../../common/common.interface';
import { ProfileCollectionsRoute } from './profile-collections.route';
import { ProfileCollectionsService } from './profile-collections.service';
import { ProfileCollectionsResponse } from './profile-collections.interface';

@Controller(ProfileCollectionsRoute.BASE)
export class ProfileCollectionsController {
    constructor(protected service: ProfileCollectionsService) {}

    // apiTitle: 'Get list of profile collections',
    @Get()
    async getProfileCollections(@Query() query: QueryProps.Default): Promise<ProfileCollectionsResponse[]> {
        return await this.service.getProfileCollections(query);
    }
}
