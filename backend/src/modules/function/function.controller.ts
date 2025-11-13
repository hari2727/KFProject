import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { QueryProps } from '../../common/common.interface';
import {
    FamiliesOnTypeResponseData,
    FamilyStatusBody,
    FunctionsSubfunctionsPayload,
    FunctionsSubfunctionsPayloadObj,
    GetJobFamilyQuery,
    JobFamily,
    JobFamilyResponse,
    JobIndustryResponse,
    JobModelDetailsQueryProps,
    JobModelDetailsResponse,
    JobModelQueryProps,
    JobModelResponse,
    LanguageFunctions,
    ProfileStasApiResponse,
    ProfileStatsQuery,
    UpdateFamilyStatusQuery,
} from './function.interface';
import { FunctionRoutes } from './function.route';
import { FunctionService } from './function.service';

@Controller(FunctionRoutes.FUNCTION)
export class FunctionController {
    constructor(protected functionService: FunctionService) {}

    // apiTitle: 'Publsh the functions',
    @Post(FunctionRoutes.PUBLISH)
    async publishTrigger(@Query() query: QueryProps.Default): Promise<any> {
        return this.functionService.publishFunction(query.loggedInUserClientId);
    }

    // apiTitle: 'Update family status of function/sub-function.',
    @Put(FunctionRoutes.UPDATE_FAMILY_STATUS)
    async updateFamilyStatus(@Query() query: UpdateFamilyStatusQuery, @Body() body: FamilyStatusBody): Promise<any> {
        return this.functionService.updateFamilyStatus(query, body);
    }

    // apiTitle: 'Get profile status for the given client.',
    @Get(FunctionRoutes.PROFILE_STATS)
    async getProfileStats(@Query() query: ProfileStatsQuery): Promise<ProfileStasApiResponse> {
        return this.functionService.getProfileStats(query);
    }

    // apiTitle: 'Get Job Families',
    @Get(FunctionRoutes.FAMILIES)
    async GetJobFamilies(@Query() query: GetJobFamilyQuery): Promise<FamiliesOnTypeResponseData[]> {
        return this.functionService.getJobFamilies(query);
    }

    // apiTitle: 'Create Job Family',
    @Post(FunctionRoutes.FAMILIES)
    async addJobFamily(@Query() query: UpdateFamilyStatusQuery, @Body() reqBody: JobFamily): Promise<JobFamilyResponse> {
        return this.functionService.addJobFamily(query, reqBody);
    }

    // apiTitle: 'Update family of function/sub-function.',
    @Put(FunctionRoutes.FAMILIES + FunctionRoutes.JOB_MODEL_ID)
    async updatefamilysubfamily(
        @Query() query: UpdateFamilyStatusQuery,
        @Body() body: FunctionsSubfunctionsPayloadObj,
        @Param('id') id: string,
    ): Promise<{ families: FunctionsSubfunctionsPayload[] }> {
        return this.functionService.updatefamilysubfamily(query, body);
    }

    // apiTitle: 'Get Job Models',
    @Get(FunctionRoutes.JOB_MODELS)
    async GetJobModels(@Query() query: JobModelQueryProps): Promise<JobModelResponse> {
        return this.functionService.getJobModels(query);
    }

    // apiTitle: 'Get Job Model Details with Id',
    @Get(FunctionRoutes.JOB_MODELS + FunctionRoutes.JOB_MODEL_ID)
    async GetJobModelDetails(@Query() query: JobModelDetailsQueryProps, @Param('id') id: string): Promise<JobModelDetailsResponse> {
        return this.functionService.getJobModelDetails(query, id);
    }

    // apiTitle: 'Get Industry Job Models',
    @Get(FunctionRoutes.INDUSTRY_JOB_MODEL_DETAILS)
    async GetIndustryJobModels(@Query() query: JobModelDetailsQueryProps, @Param('id') id: string): Promise<JobIndustryResponse> {
        return this.functionService.getIndustryJobModels(query, id);
    }

    // apiTitle: 'Create Language support function',
    @Post(FunctionRoutes.ADD_FUNCTION)
    async addLanguageFunction(@Query() query: UpdateFamilyStatusQuery, @Body() reqBody: LanguageFunctions): Promise<any> {
        return this.functionService.addLanguageFunction(query, reqBody);
    }
}
