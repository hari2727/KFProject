import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { QueryProps } from '../../common/common.interface';
import { ComponentListItemResponse, ModelQuery, SkillListItemResponse } from './skill-component.dto';
import {
    ComponentDetailsResponse,
    CreateComponentOptions,
    CreateComponentsPayload,
    CreateComponentsResponse,
    SkillComponentsLinksPayload,
    SkillDetailsResponse,
    SkillOriginalComponentsResponse
} from './skill-component.interface';
import { SkillComponentService } from './skill-component.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('sc')
export class SkillComponentController {

    constructor(
        protected service: SkillComponentService,
    ) {
    }

    @ApiOperation({ summary: 'Get All Skills' })
    @Get('/skills')
    async getSkillListItems(
        @Query() query: ModelQuery
    ): Promise<SkillListItemResponse[]> {
        return await this.service.getSkillListItems(query.modelGUID, query.modelVersion, query.loggedInUserClientId, query.locale);
    }

    @ApiOperation({ summary: 'Get Skill Details' })
    @Get('/skills/:id')
    async getSkillDetails(
        @Param('id', ParseIntPipe) skillId: number,
        @Query() query: QueryProps.Default
    ): Promise<SkillDetailsResponse> {
        return await this.service.getSkillDetails(skillId, query.loggedInUserClientId, query.locale);
    }

    @ApiOperation({ summary: 'Get Original Components Of Skill on Revert' })
    @Get('/skills/:id/original')
    async getOriginalSkillComponents(
        @Param('id', ParseIntPipe) skillId: number,
        @Query() query: QueryProps.Default
    ): Promise<SkillOriginalComponentsResponse> {
        return await this.service.getOriginalSkillComponents(skillId, query.loggedInUserClientId, query.locale);
    }

    @ApiOperation({ summary: 'Save Reverted Components Of Skill' })
    @Post('/skills/:id/revert')
    async revertSkillChanges(
        @Param('id', ParseIntPipe) skillId: number,
        @Query() query: QueryProps.Default
    ): Promise<SkillOriginalComponentsResponse> {
        return await this.service.revertSkillChanges(skillId, query.loggedInUserClientId, query.userId);
    }

    @ApiOperation({ summary: 'Link Skills And Components' })
    @Post('/link')
    async linkSkillsAndComponents(
        @Query() query: ModelQuery,
        @Body() payload: SkillComponentsLinksPayload
    ): Promise<void> {
        await this.service.linkSkillsAndComponents(payload, query.loggedInUserClientId, query.userId, query.locale, query.modelGUID, query.modelVersion);
    }

    @ApiOperation({ summary: 'Get Component Lists Items' })
    @Get('/components')
    async getComponentListItems(
        @Query() query: ModelQuery
    ): Promise<ComponentListItemResponse[]> {
        return await this.service.getComponentListItems(query.modelGUID, query.modelVersion, query.loggedInUserClientId, query.locale);
    }

    @ApiOperation({ summary: 'Get Components Details' })
    @Get('/components/:id')
    async getComponentDetails(
        @Param('id', ParseIntPipe) componentId: number,
        @Query() query: QueryProps.Default
    ): Promise<ComponentDetailsResponse> {
        return await this.service.getComponentDetails(componentId, query.loggedInUserClientId, query.locale);
    }

    @ApiOperation({ summary: 'Update Components Details - ComponentGlobalActiveState' })
    @Put('/components/:id')
    async updateComponentDetails(
        @Param('id', ParseIntPipe) componentId: number,
        @Query() query: QueryProps.Default,
        @Body() payload: CreateComponentOptions
    ): Promise<void> {
        await this.service.updateComponentDetails(componentId, payload, query.loggedInUserClientId, query.userId, query.locale);
    }

    @ApiOperation({ summary: 'Update Components - Add Components in Skill' })
    @Post('/components')
    async createComponents(
        @Query() query: ModelQuery,
        @Body() payload: CreateComponentsPayload
    ): Promise<CreateComponentsResponse> {
        return await this.service.createComponents(payload, query.loggedInUserClientId, query.userId, query.locale, query.modelGUID, query.modelVersion);
    }

    /*
        existing legacy endpoint should be used

            create skill
            update skill
            get original skill
            revert skill changes
            show/hide skill
            get status of changes
            publish changes
     */
}
