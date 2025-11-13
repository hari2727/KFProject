import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { QueryProps } from '../../common/common.interface';
import {
    GetJobPropertiesQuery,
    JobPropertiesByIDData,
    JobPropertiesListData,
    JobPropertyRequest,
    QueryParams
} from './job-properties.interface';
import { JobPropertyService } from './job-properties.service';

@Controller('jobproperties')
export class JobPropertyController {
    constructor(
        private readonly jobPropertyService: JobPropertyService
    ) {}

    // apiTitle: 'Add/Update the JobProperty',
    // returnDescription: 'Returns the Job Property List',
    @Post()
    async insUpdateJobProperty(@Query() query: QueryParams, @Body() body: JobPropertyRequest): Promise<JobPropertiesListData> {
        return this.jobPropertyService.updateJobProperties(query, body);
    }

    // apiTitle: 'Get List of Job Properties for the client based on clientId',
    // returnDescription: 'Returns the Job Property List',
    // isSearchSortPageable: true,
    @Get()
    async getJobPropertiesOfClient(@Query() query: GetJobPropertiesQuery): Promise<JobPropertiesListData> {
        const clientId = (query.clientId ? parseInt(query.clientId, 10) : 0) || query.loggedInUserClientId;
        return await this.jobPropertyService.getAllJobPropertiesByClientId(clientId);
    }

    // apiTitle: 'Get List of Job Properties by Job Property Id',
    // returnDescription: 'Returns all the Job Properties in a list for a particular Job Property Id',
    // isSearchSortPageable: true,
    @Get('/:jobPropertyId')
    async getJobPropertiesByJobPropertyId(@Query() query: QueryProps.Default, @Param('jobPropertyId') jobPropertyId: string): Promise<JobPropertiesByIDData> {
        return await this.jobPropertyService.getJobPropertiesByJobPropertyId(query.loggedInUserClientId, jobPropertyId);
    }

    // apiTitle: 'Publish the Job Properties',
    // returnDescription: 'Returns success or error based on the publish action',
    @Post('/action/publish')
    async publishJobProperties(@Query() query: QueryProps.Default): Promise<void> {
        await this.jobPropertyService.publishJobProperties(query.loggedInUserClientId, query.locale, query.userId);
    }

}
