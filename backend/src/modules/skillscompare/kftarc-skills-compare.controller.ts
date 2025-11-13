import { Body, Controller, Post, Query } from '@nestjs/common';
import { KfTarcCompareSkillsService } from './kftarc-skills-compare.service';
import { KfTarcCompareSkillsRoute } from './kftarc-skills-compare.route';

@Controller(KfTarcCompareSkillsRoute.BASE)
export class KfTarcCompareSkillsController {
    constructor(protected compareSkillsService: KfTarcCompareSkillsService) {}

    // apiTitle: 'Compare SP and Arya skills',
    @Post('v1')
    async compareSkills(@Query() query, @Body() body) {
        return await this.compareSkillsService.compareSkills(query, body);
    }

    // apiTitle: 'Compare SP and Arya skills',
    @Post()
    async compareSkillsV2(@Query() query, @Body() body) {
        return await this.compareSkillsService.mapSkillsAndProfilesV1(query, body);
    }

    // apiTitle: 'Compare SP and Arya skills',
    @Post('profiles')
    async getProfiles(@Query() query, @Body() body) {
        return await this.compareSkillsService.getProfiles(query, body);
    }
}
