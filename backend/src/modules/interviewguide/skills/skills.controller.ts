import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { IgSkillsRoute } from './skills.route';
import { IgSkillsService } from './skills-service';
import { IgGetMultipleSkillsWithQuestionsPayload, IgUpdateSkillQuestionsPayload } from './skills-service.types';

@Controller(IgSkillsRoute.BASE)
export class IgSkillsController {

    constructor(
        protected skillsService: IgSkillsService,
    ) {}

    @Get()
    async getSkills(
        @Query('loggedInUserClientId') clientId: string,
        @Query('linkedToCustomSP') linkedToCustomSuccessProfile: any,
    ): Promise<any> {
        return await this.skillsService.getSkills(Number(clientId), Boolean(Number(linkedToCustomSuccessProfile)))
    }

    @Get(':id')
    async getSkillWithQuestions(
        @Param('id') skillId: string,
        @Query('loggedInUserClientId') clientId: string,
    ): Promise<any> {
        return await this.skillsService.getSkillWithQuestions(Number(clientId), Number(skillId));
    }

    @Get(':id/original')
    async getSkillWithStandardQuestions(
        @Param('id') skillId: string,
        @Query('loggedInUserClientId') clientId: string,
    ): Promise<any> {
        return await this.skillsService.getSkillWithStandardQuestions(Number(clientId), Number(skillId));
    }

    @Post('questions')
    async getMultipleSkillsWithQuestions(
        @Query('loggedInUserClientId') clientId: string,
        @Query('locale') locale: string,
        @Body() body: IgGetMultipleSkillsWithQuestionsPayload,
    ): Promise<any> {
        return await (
            body.questionsOnly
                ? this.skillsService.getSuccessProfileSkillsQuestions(Number(clientId), locale, body)
                : this.skillsService.getMultipleSkillsWithQuestions(Number(clientId), locale, body)
        );
    }

    @Post(':id')
    async updateSkillQuestions(
        @Param('id') skillId: string,
        @Query('loggedInUserClientId') clientId: string,
        @Query('userId') userId: string,
        @Body() body: IgUpdateSkillQuestionsPayload
    ): Promise<any> {
        return await this.skillsService.updateSkillQuestions(Number(clientId), Number(userId), Number(skillId), body);
    }

    @Put(':id/original')
    async discardSkillCustomQuestions(
        @Param('id') skillId: string,
        @Query('loggedInUserClientId') clientId: string,
        @Body() body: IgUpdateSkillQuestionsPayload
    ): Promise<any> {
        return await this.skillsService.discardSkillCustomQuestions(Number(clientId), Number(skillId));
    }

}
