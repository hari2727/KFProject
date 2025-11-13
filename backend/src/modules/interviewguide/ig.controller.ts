import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { IgRoute } from './ig.route';
import { IgModel } from './model/ig-model.i';
import { IgService } from './ig.service';
import { IgUiModel } from './model/ig-ui-model.i';
import { AppCode as ec } from '../../app.const';
import { IgSplitInterviewPostBody } from './model/ig-split-interview-post-body.i';
import { QueryProps } from '../../common/common.interface';
import { MapErrors } from '../../_shared/error/map-errors.decorator';

@Controller(IgRoute.BASE)
export class IgController {

    constructor(
        protected service: IgService,
    ) {}

    // 201
    @Post()
    @MapErrors({ errorCode: ec.INTERVIEW_GUIDE_ERR })
    endPointLogic(
        @Query() query: QueryProps.Default,
        @Body() body: IgSplitInterviewPostBody
    ) {
        return this.service.splitInterview(query, body);
    }

    // apiTitle: 'Get IG from CMS or CosmosDB',
    @Get(IgRoute.COMPETENCIES)
    getCompetencies(
        @Query('loggedInUserClientId') clientId: string,
        @Query('locale') locale: string,
        @Query('userId') userId: string,
    ): Promise<IgUiModel.Draft> {
        return this.service.getInterviewGuideCompetencies(clientId, locale, userId);
    }

    // apiTitle: 'Get Competency from CMS or CosmosDB',
    @Get(IgRoute.COMPETENCIES + IgRoute.PARAM_ID)
    getCompetency(
        @Param('id') id: string,
        @Query('loggedInUserClientId') clientId: string,
        @Query('locale') locale: string
    ): Promise<IgUiModel.UICompetency | {}> {
        return this.service.getInterviewGuideCompetency(id, clientId, locale);
    }

    // apiTitle: 'Update IG Draft with changes from Framework (custom competencies and custom names for standart comps)',
    @Put(IgRoute.COMPETENCIES + IgRoute.CUSTOM_CONTENT)
    updateInterviewGuideCustomComps(
        @Query('loggedInUserClientId') clientId: string,
        @Query('locale') locale: string,
        @Query('userId') userId: string,
    ): Promise<any> {
        return this.service.upsertDraftWithCustomContent(clientId, locale, userId);
    }

    // apiTitle: 'Publish IG draft to CMS',
    @Put(IgRoute.COMPETENCIES + IgRoute.ORIGINAL)
    publishInterviewGuide(
        @Query('loggedInUserClientId') clientId: string,
        @Query('locale') locale: string,
        @Query('userId') userId: string,
    ): Promise<any> {
        return this.service.publishInterviewGuideDraft(clientId, locale, userId);
    }

    // apiTitle: 'Save customn IG draft to mongoDB',
    @Put(IgRoute.COMPETENCIES + IgRoute.PARAM_ID)
    putCompetency(
        @Param('id') id: string,
        @Query('loggedInUserClientId') clientId: string,
        @Query('locale') locale: string,
        @Query('userId') userId: string,
        @Body() body: IgModel.Competency
    ): Promise<any> {
        return this.service.putInterviewGuideDraft(id, clientId, locale, userId, body);
    }

    // apiTitle: 'Get competency Base Content',
    @Get(IgRoute.COMPETENCIES + IgRoute.ORIGINAL + IgRoute.PARAM_ID)
    getBaseCompetency(
        @Param('id') competencyId: string,
        @Query('loggedInUserClientId') clientId: string,
        @Query('locale') locale: string,
    ): Promise<IgUiModel.UICompetency | {}> {
        return this.service.getCompetencyBaseContent(competencyId, clientId, locale);
    }

}
