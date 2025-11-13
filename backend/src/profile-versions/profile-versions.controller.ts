import { Controller, Get, Query } from '@nestjs/common';
import { ProfileVersionsRoute } from './profile-versions.route';
import { AppCode as ec } from '../app.const';
import { ProfileVersionsService } from './profile-versions.service';
import { ProfileVersionsQuery, ProfileVersionsResponse } from './profile-versions.interface';
import { MapErrors } from '../_shared/error/map-errors.decorator';

@Controller(ProfileVersionsRoute.BASE)
export class ProfileVersionsController {
    constructor( protected profileVersionService: ProfileVersionsService) {}

    // apiTitle: 'Get Profile Version details',
    @Get()
    @MapErrors({ errorCode: ec.PROFILE_VERSIONS_ERR })
    async getProfileVersionDetails(@Query() query: ProfileVersionsQuery): Promise<ProfileVersionsResponse[]> {
        return this.profileVersionService.getProfileVersionDetails(query);
    }
}
