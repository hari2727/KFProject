import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AppCode as ec } from '../../app.const';
import { DashboarSummaryDataServiceToken } from './summary.tokens';
import {
    DashboarSummaryDataService,
    DownloadProcResponse,
    FilterBy,
    FilterByType,
    FilterType,
    FunctionsProcResponse,
    LevelsProcResponse,
    ProfileType,
    SuccessProfilesJobDescriptions,
    SuccessProfilesJobDescriptionsProcResponse,
    SummaryDashboardResponse,
    SummaryDownloads,
    SummaryFunctionsData,
    SummaryJobs,
    SummaryLevel,
    SummaryQuery,
} from './summary.interface';
import { KfTarcRolesInterface as Kf } from '../roles/kftarc-roles.interface';
import { RequestCommon } from '../../common/common.utils';
import { AuthDetails } from '../../common/request-factory.interface';
import { RequestFactory } from '../../common/request-factory';
import { MapErrors } from '../../_shared/error/map-errors.decorator';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { HttpsService } from '../../_shared/https/https.service';

@Injectable()
export class SuccessProfileDashboardSummaryService {
    protected tarcReportApiBase: string;

    constructor(
        @Inject(DashboarSummaryDataServiceToken)
        protected dashboardSummaryService: DashboarSummaryDataService,
        protected https: HttpsService,
        protected requestCommon: RequestCommon,
        protected request: RequestFactory,
    ) {
        this.tarcReportApiBase = this.requestCommon.getKfhubApiTarcBaseUrl();
    }

    @MapErrors({ errorCode: ec.EXTERNAL_CALL_ERR })
    @LogErrors()
    async getDashboardSummaryData(query: SummaryQuery, request: Request): Promise<SummaryDashboardResponse> {
            let viewFlag = 0;
            let modifiedFlag = 0;
            let createdFlag = 0;
            let sectionProductId = 0;

            const auth = this.request.getAuthDetails(request);
            const permissions = await this.getPermissions(request, auth);
            const restrictions = this.requestCommon.checkUAMPointsRestrictions(permissions);

            let pointValue = restrictions.pointValue;
            const hasPointValueAccess = permissions.hasPointValueAccess;
            const hasExecutiveAccessByPointValue = permissions.hasExecutiveAccessByPointValue;

            sectionProductId = query.type === FilterType.SUCCESS_PROFILE ? ProfileType.SUCCESS_PROFILE : ProfileType.JOB_DESCRIPTION;
            if (query?.type && query?.filterBy) {
                if (query.filterBy === FilterBy.RECENTLY_VIEWED) {
                    viewFlag = 1;
                } else if (query.filterBy === FilterBy.RECENTLY_MODIFIED) {
                    modifiedFlag = 1;
                } else if (query.filterBy === FilterBy.RECENTLY_CREATED) {
                    createdFlag = 1;
                }
                if (query.type === FilterType.SUCCESS_PROFILE) {
                    const successProfilesProc = await this.dashboardSummaryService.getSuccessProfiesJobDescriptions(
                        query,
                        pointValue,
                        sectionProductId,
                        viewFlag,
                        modifiedFlag,
                        createdFlag,
                        hasPointValueAccess,
                        hasExecutiveAccessByPointValue,
                    );
                    const successProfiles = await this.mapSuccessProfilesJobDescriptions(successProfilesProc, FilterType.SUCCESS_PROFILE, query.filterBy);
                    return {
                        successProfiles,
                    };
                }
            }
            return this.getAllRecordsForDashboard(
                query,
                pointValue,
                sectionProductId,
                viewFlag,
                modifiedFlag,
                createdFlag,
                hasPointValueAccess,
                hasExecutiveAccessByPointValue,
                auth,
            );
    }

    protected async getAllRecordsForDashboard(
        query: SummaryQuery,
        pointValue: number,
        sectionProductId: ProfileType,
        viewFlag: number,
        modifiedFlag: number,
        createdFlag: number,
        hasPointValueAccess: boolean,
        hasExecutiveAccessByPointValue: boolean,
        auth: AuthDetails,
    ): Promise<SummaryDashboardResponse> {
        const filterByRecent = [FilterBy.RECENTLY_CREATED, FilterBy.RECENTLY_MODIFIED].includes(query.filterBy);

        const getJobDescriptions = (
            sectionProductId: ProfileType,
            modifiedFlag: number,
            createdFlag: number,
        ): Promise<SuccessProfilesJobDescriptionsProcResponse> =>
            this.dashboardSummaryService.getSuccessProfiesJobDescriptions(
                query,
                pointValue,
                sectionProductId,
                viewFlag,
                modifiedFlag,
                createdFlag,
                hasPointValueAccess,
                hasExecutiveAccessByPointValue,
            );

        const emptyResult = { TotalResultRecords: 0, Jobs: [] };
        let [downloadsProc, functionsProc, levelProc, jobDescriptionsProc, successProfilesProc] = await Promise.all([
            this.dashboardSummaryService.getDownloadsData(query, hasPointValueAccess, hasExecutiveAccessByPointValue, pointValue),
            this.dashboardSummaryService.getFunctionData(query),
            this.dashboardSummaryService.getLevelsData(query),
            ...[
                query.type
                    ? filterByRecent
                        ? getJobDescriptions(ProfileType.JOB_DESCRIPTION, modifiedFlag, createdFlag)
                        : emptyResult
                    : getJobDescriptions(ProfileType.JOB_DESCRIPTION, modifiedFlag, 1),
            ],
            ...[query.type ? emptyResult : getJobDescriptions(ProfileType.SUCCESS_PROFILE, 1, createdFlag)],
        ]);
        const jobdescriptions: SuccessProfilesJobDescriptions = await this.mapSuccessProfilesJobDescriptions(
            jobDescriptionsProc,
            FilterType.JOB_DESCRIPTION,
            query.filterBy,
            auth,
        );
        const successProfiles: SuccessProfilesJobDescriptions = await this.mapSuccessProfilesJobDescriptions(
            successProfilesProc,
            FilterType.SUCCESS_PROFILE,
            query.filterBy,
        );
        const levelsData = this.mapLevelsData(levelProc);
        const funcData = this.mapFunctionsData(functionsProc);
        const downloadData = this.mapDownloadsData(downloadsProc, auth);
        return {
            ...(levelsData.levels?.length?{level: levelsData}:{} ),
            ...(funcData?.length? {functions: funcData}:{} ),
            ...(downloadData?.length? {downloads: downloadData}:{} ),
            ...((query.type ? !filterByRecent : query.filterBy) ? {} : jobDescriptionsProc.Jobs?.length?{ jobdescriptions }:{}),
            ...(query.type ? {} : successProfiles.jobs?.length?{ successProfiles }:{}),
        };
    }

    @MapErrors({ errorCode: ec.EXTERNAL_CALL_ERR })
    @LogErrors()
    async getPermissions(request: Request, auth: AuthDetails): Promise<Kf.SuccessProfilesPermissions> {
            const url = this.requestCommon.getPermissionsUrl();
            const headers = this.requestCommon.getKfhubApiHeaders(auth.authToken, auth.sessionId);
            const permissions = await this.https.get(url, headers);
            return permissions as Kf.SuccessProfilesPermissions;
    }

    protected mapDownloadsData(downloads: DownloadProcResponse[], auth: AuthDetails): SummaryDownloads[] {
        const downloadsData: SummaryDownloads[] = [];
        (downloads || []).forEach(downloads => {
            const download: SummaryDownloads = {
                id: +downloads.ClientJobID,
                title: downloads.JobName,
                reportType: downloads.ReportType,
                jobExportUrl: this.tarcReportApiBase + `/download/sucessprofile?spId=${+downloads.ClientJobID}&authToken=${auth.authToken}`,
            };
            downloadsData.push(download);
        });
        return downloadsData;
    }

    protected mapFunctionsData(functions: FunctionsProcResponse[]) {
        const functionsData: SummaryFunctionsData[] = [];
        (functions || []).forEach((functionData: FunctionsProcResponse) => {
            const data: SummaryFunctionsData = {
                id: functionData?.FunctionID || functionData?.JobFamilyID,
                name: functionData?.Function || functionData?.JobFamilyName,
                value: functionData.Usage,
            };

            functionsData.push(data);
        });
        return functionsData;
    }

    protected mapLevelsData(levels: LevelsProcResponse[]): SummaryLevel {
        let levelsData: SummaryLevel = {
            levels: [],
            totalResultRecords: 0,
        };
        (levels || []).forEach((level: LevelsProcResponse) => {
            const data: SummaryFunctionsData = {
                id: level.KFManagementID,
                name: level.KFManagementName,
                value: level.KFMCount,
            };
            levelsData.levels.push(data);
        });
        levelsData.totalResultRecords = levels?.length ? levels[0].TotalKFMCount : 0;
        return levelsData;
    }

    protected async mapSuccessProfilesJobDescriptions(
        jobDescriptions: SuccessProfilesJobDescriptionsProcResponse,
        filterType: FilterType,
        filterBy: FilterBy,
        auth?: AuthDetails,
    ): Promise<SuccessProfilesJobDescriptions> {
        let jobsData: SuccessProfilesJobDescriptions = {
            jobs: [],
            totalResultRecords: 0,
        };
        for(const element of jobDescriptions?.Jobs || []){
            const userId = this.extractUserId(element.CreatedByFirstName);
            const userData = await this.dashboardSummaryService.getUserData(userId);
            const job: SummaryJobs = {
                id: +element.ClientJobID,
                title: element.JobName,
                familyName: element.JobFamilyName,
                subFamilyName: element.JobSubFamilyName,
                noOfDependantJobs: element.RelatedJobDescriptions,
                profileType: element.LevelType,
                managementLabel: element.KFManagementName,
                firstName: userData.FirstName || '',
                lastName: userData.LastName || '',
                effectiveDateTime: +element.ModifiedOn,
                viewedDateTime: element.ViewDate,
                type: filterBy === FilterBy.RECENTLY_VIEWED ? FilterByType.CREATED_BY : FilterBy.RECENTLY_MODIFIED,
                parentJobDetails: {
                    id: element.BasedOnJobID,
                    title: element.BasedOnJobName,
                },
                ...(filterType === FilterType.JOB_DESCRIPTION
                    ? { jobExportUrl: this.tarcReportApiBase + `/download/jobdescription?jobId=${+element.ClientJobID}&authToken=${auth.authToken}` }
                    : {}),
            };
            jobsData.jobs.push(job);
        }
        jobsData.totalResultRecords = jobDescriptions.TotalResultRecords || 0;
        return jobsData;
    }

    protected extractUserId(userId: string) {
        return userId.substring(userId.indexOf('#')+1, userId.lastIndexOf('#'));
    }
}
