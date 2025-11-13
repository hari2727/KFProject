import { Injectable } from '@nestjs/common';
import {
    DashboarSummaryDataService,
    DownloadProcResponse,
    FunctionsProcResponse,
    LevelsProcResponse,
    SuccessProfilesJobDescriptionsProcResponse,
    SummaryQuery,
    SummaryValues,
    UserDataResponse,
} from './summary.interface';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { escapeQueryWithParams } from '../../_shared/db/typeorm';
import { toBit, toLocale, toNumber, toStringOr } from '../../_shared/convert';
import { TypeOrmHelper } from '../../_shared/db/typeorm.helper';

@Injectable()
export class SummaryDataService implements DashboarSummaryDataService {

    constructor(protected sql: TypeOrmHelper) {
    }

    @LogErrors()
    async getSuccessProfiesJobDescriptions(
        query: SummaryQuery,
        pointValue: number,
        sectionProductId: number,
        viewFlag: number,
        modifiedFlag: number,
        createdFlag: number,
        hasPointValueAccess: boolean,
        hasExecutiveAccessByPointValue: boolean,
    ): Promise<SuccessProfilesJobDescriptionsProcResponse> {
        const { isExecutivePointValueAccess, accessPoints } = this.getSummaryValues(hasPointValueAccess, hasExecutiveAccessByPointValue, pointValue);
        const [insertEscapedQuery, insertParameters] = escapeQueryWithParams(this.sql.dataSource, `
            exec SuccessProfile.dbo.GetMySuccessProfileJobDescription
                @PersonID = :userId,
                @SectionproductId = :sectionProductId,
                @ViewedFlag = :viewFlag,
                @ModifiedFlag = :modifiedFlag,
                @CreatedFlag = :createdFlag,
                @LCID = :locale,
                @IsExec = :isExec,
                @AccessPoints = :accessPoints
            `,
            {
                userId: toNumber(query.userId),
                sectionProductId: toNumber(sectionProductId),
                viewFlag: toBit(viewFlag),
                modifiedFlag: toBit(modifiedFlag),
                createdFlag: toBit(createdFlag),
                locale: toLocale(query.locale),
                isExec: toNumber(isExecutivePointValueAccess),
                accessPoints: toNumber(accessPoints),
            }
        );
        return await this.successProfilesJobsDescriptionsDataStream(insertEscapedQuery, insertParameters)
    }

    @LogErrors()
    async getFunctionData(query: SummaryQuery): Promise<FunctionsProcResponse[]> {
        return await this.sql.query(`
                exec SuccessProfile.dbo.UsageByFunction
                    @ClientId = :clientId,
                    @LCID = :locale
           `,
            {
                clientId: toNumber(query.loggedInUserClientId),
                locale: toLocale(query.locale)
            }
        );
    }

    @LogErrors()
    async getLevelsData(query: SummaryQuery): Promise<LevelsProcResponse[]> {
        return await this.sql.query(`
                use SuccessProfile

                Declare
                    @ClientID BigInt,
                    @LCID nvarchar(20)

                Set @ClientID = :clientId
                Set @LCID = :locale;
                ;WITH JDM AS (
                    Select
                        *
                    from
                        SuccessProfile.dbo.Fn_GetFamilySubFamilyForClient(@ClientID,@LCID)
                )
                Select
                    KFM.KFManagementID,
                    COALESCE(KFMT.KFManagementName, KFM.KFManagementName) KFManagementName,
                    SUM(ISNULL(CJ.CNT, 0)) KFMCount,
                    SUM(SUM(ISNULL(CJ.CNT, 0))) over() TotalKFMCount
                from
                    SuccessProfile.dbo.KFManagement KFM
                left outer join (
                    Select
                        KFManagementID,
                        KFManagementName
                    from
                        SuccessProfile.dbo.KFManagementTranslation
                    where
                        LCID = @LCID
                ) KFMT
                    on
                        KFM.KFManagementID = KFMT.KFManagementID
                left outer join
                    SuccessProfile.dbo.KFLevel KFL
                        on
                            KFL.KFManagementID = KFM.KFManagementID
                left OUTER JOIN (
                    Select
                        CJ.KFLevelID,
                        Count(1) CNT
                    from
                        SuccessProfile.dbo.CLientJob CJ
                    inner join (
                        Select
                            PersonID
                        from
                            SuccessProfile.dbo.Person
                        where
                            ClientID = @ClientID
                    ) P
                        on
                            P.PersonID = CJ.JobSOurceID
                    where
                        CJ.JobSourceID not in (0, 1) --custom profiles
                            and
                        CJ.ClientJobStatusID not in (4, 8) -- exclude deleted and archived
                            and
                        SectionProductID = 1 -- SuccessProfiles
                            and
                        EXISTS (
                            Select
                                1
                            from
                                JDM
                            where
                                jdm.JobSubFamilyID = substring(cj.JRTDetailID, 1, LEN(cj.JRTDetailID) - 4)
                        )
                            AND
                        CJ.LCID = @LCID
                            AND
                        ISNULL(CJ.HideJobInPM, 0) = 0
                    Group by
                        CJ.KFLevelID
                ) CJ
                    on
                        KFL.KFLevelID = CJ.KFLevelID
                group by
                    KFM.KFManagementID,
                    COALESCE(KFMT.KFManagementName,KFM.KFManagementName)
                order by
                    KFM.KFManagementID ASC
            `,
            {
                clientId: toNumber(query.loggedInUserClientId),
                locale: toLocale(query.locale)
            }
        );
    }

    @LogErrors()
    async getDownloadsData(
        query: SummaryQuery,
        hasPointValueAccess: boolean,
        hasExecutiveAccessByPointValue: boolean,
        pointValue: number,
    ): Promise<DownloadProcResponse[]> {
        const { accessResCondition } = this.getSummaryValues(hasPointValueAccess, hasExecutiveAccessByPointValue, pointValue);
        return await this.sql.query(`
                use SuccessProfile

                Declare
                    @PersonID BigInt,
                    @LCID nvarchar(20),
                    @ClientID BigInt

                Set @PersonID = :userId
                Set @LCID = :locale
                Set @ClientID = :clientId;

                SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED
                SELECT
                    DISTINCT TOP 6 *
                FROM
                    (
                        SELECT
                            CJD.ClientJobID,
                            COALESCE(CJT.JobName, CJ.JobName) AS JobName,
                            CJD.ReportType,
                            MAX(CJD.DownloadedDate) DownloadedDate
                        FROM (
                            SELECT
                                ClientJobID,
                                ReportType,
                                DownloadedDate
                            FROM
                                SuccessProfile.dbo.ClientJobDownload
                            WHERE
                                DownloadedBy = @PersonID
                        ) AS CJD
                        INNER JOIN (
                            Select
                                ClientJobID,
                                JobName,
                                JobSourceID,
                                LCID
                            from
                                SuccessProfile.dbo.ClientJob
                            where
                                ClientJobStatusID NOT IN (4, 8, 9)
                        ) CJ
                            on
                                CJD.ClientJobID = CJ.ClientJobID
                        INNER JOIN
                            SuccessProfile.dbo.ClientJobExtension AS CJE
                                ON
                                    CJ.ClientJobiD = CJE.ClientJobID
                        LEFT OUTER JOIN (
                            Select
                                ClientJobID,
                                JobName
                            from
                                SuccessProfile.dbo.ClientJobTranslation
                            where
                                LCID = @LCID
                        ) CJT
                            on
                                CJ.ClientJobID = CJT.ClientJobID
                        where
                            (
                                (
                                    CJ.JobSourceID in (0, 1)
                                        and
                                    LCID = 'en'
                                )
                                    OR
                                (
                                    JobSourceID = @PersonID
                                        and
                                    LCID = @LCID
                                        ${accessResCondition}
                                )
                            )
                                AND
                            CJ.ClientJobID NOT IN (
                                Select
                                    *
                                from
                                    SuccessProfile.dbo.fn_CheckKFAUserPermisssions(@ClientID, @PersonID)
                            )
                        GROUP BY
                            CJD.ClientJobID,
                            CJT.JobName,
                            CJ.JobName,
                            CJD.ReportType
                    ) A
                ORDER BY
                    DownloadedDate DESC
            `,
            {
                userId: toNumber(query.userId),
                locale: toLocale(query.locale),
                clientId: toNumber(query.loggedInUserClientId)
            }
        );
    }

    @LogErrors()
    async getUserData(piid: string):Promise<UserDataResponse> {
        return (await this.sql.query(`
                exec ActivatePII.dbo.spr_GetPersonListByPiiID
                    @PiiID = :piid
            `,
            {
                piid: toStringOr(piid)
            }
        ))[0];
    }

    protected getSummaryValues(hasPointValueAccess: boolean, hasExecutiveAccessByPointValue: boolean, pointValue: number): SummaryValues {
        let summaryValues: SummaryValues = {
            isExecutivePointValueAccess: 0,
            accessPoints: pointValue || 0,
            accessResCondition: '',
        };
        if (hasPointValueAccess) {
            if (hasExecutiveAccessByPointValue) {
                summaryValues.isExecutivePointValueAccess = 1;
                summaryValues.accessResCondition = ` AND (CJE.HayPoints>=${summaryValues.accessPoints}  OR CJE.HayPoints IS NULL )`;
            } else {
                summaryValues.isExecutivePointValueAccess = 2;
                summaryValues.accessResCondition = ` AND (CJE.HayPoints<=${summaryValues.accessPoints}  OR CJE.HayPoints IS NULL )`;
            }
        }
        return summaryValues;
    }

    protected async successProfilesJobsDescriptionsDataStream(
        storeProcQuery: string,
        insertParameters: any[],
        divider = 'ClientJobID',
    ): Promise<SuccessProfilesJobDescriptionsProcResponse> {
        return new Promise<any>(async (resolve, reject) => {
            const data = await this.sql.dataSource.createQueryRunner().stream(storeProcQuery, insertParameters);
            let resp: any = {};
            data.on('data', (chunk: any) => {
                if (Object.keys(chunk).includes(divider)) {
                    if (resp['Jobs'] && resp['Jobs'].length) {
                        resp['Jobs'].push(chunk);
                    } else {
                        resp['Jobs'] = [chunk];
                    }
                } else {
                    resp['TotalResultRecords'] = chunk['TotalResultRecords'];
                }
            });
            data.on('end', () => resolve(resp as any));
        });
    }
}
