import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';

import { AppCode as ec } from '../../../app.const';
import { KfTarcAryaService } from './kftarc-arya.service';
import {
    KfTarcAlternativeJobsParams,
    KfTarcArayPeerGroups,
    KfTarcAryaMetadata,
    KfTarcAryaSkillCompareDto,
    KfTarcAryaSkills,
    KfTarcAryaSkillsEnum,
} from './kftarc-arya.interface';
import { KfTarcAryaRoute } from './kftarc-arya.route';
import { MapErrors } from '../../../_shared/error/map-errors.decorator';

@Controller(KfTarcAryaRoute.BASE)
export class KfTarcAryaController {
    constructor(protected service: KfTarcAryaService) {}

    @Get()
    @MapErrors({ errorCode: ec.SKILL_ERR })
    async get(@Query() query: KfTarcAryaSkills) {
        if (!query.type) {
            query.type = KfTarcAryaSkillsEnum.MARKET;
        }
        if (!query.topCount) {
            query.topCount = '10';
        }

        if (query.type == KfTarcAryaSkillsEnum.ORGANIZATION && !query.clientNames) {
            throw new BadRequestException('Invalid clientNames detail');
        }

        return await this.service.getSkills(query);
    }

    @Get('industries')
    @MapErrors({ errorCode: ec.INDUSTRIES_ERR })
    async getMetadata(@Query() query: KfTarcAryaMetadata) {
        return await this.service.getIndustries();
        // return mockMetadata;
    }

    @Get('alternatejobtitles')
    @MapErrors({ errorCode: ec.ALTERNATE_JOB_TITLES_ERR })
    async getAlternateJobTitles(@Query() query: KfTarcAlternativeJobsParams) {
        if (!query.topCount) {
            query.topCount = '10';
        }
        return await this.service.jobTitles(query);
    }

    @Get('peergroups')
    @MapErrors({ errorCode: ec.PEER_GROUPS_ERR })
    async getPeerGroups(@Query() query: KfTarcArayPeerGroups) {
        if (!query.topCount) {
            query.topCount = '100';
        }
        if (!query.searchString) {
            query.searchString = '';
        }

        return await this.service.peerGroups(query);

        // return mockPeerGroups;
    }

    @Post('compare')
    async compare(@Body() body: KfTarcAryaSkillCompareDto) {
        return await this.service.compareSkills(body);
    }
}
