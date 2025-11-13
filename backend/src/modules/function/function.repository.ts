import * as moment from 'moment';
import {
    AddJobFamilyResponse,
    FamilesValidation,
    FAMILY_TYPE,
    FamilyStatusBody,
    FamilySubFamilyModel,
    FamilySubFamilyParams,
    FunctionsSubfunctionsPayload,
    FunctionsSubfunctionsPayloadObj,
    FunctionSubFamilies,
    GetJobFamilyQuery,
    GetJobFamilyResponse,
    JobClientIndustryDbValues,
    JobFamily,
    JobFamilySubFamilyParams,
    JobModelDbResponse,
    JobModelDetailsQueryProps,
    JobModelQueryProps,
    LanguageFunction,
    LanguageSubFunction,
    ParamsObj,
    ProfileStats,
    ProfileStatsQuery,
    SubFamilesValidation,
    UpdateFamilyStatusQuery,
} from './function.interface';
import { AppCode as ec } from '../../app.const';
import { AppError } from '../../_shared/error/app-error';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { Injectable } from '@nestjs/common';
import { toBit, toBoolean, toLocale, toNumber, toStringOr } from '../../_shared/convert';
import { escapeSingleQuote } from '../../common/common.utils';
import { TypeOrmHelper } from '../../_shared/db/typeorm.helper';
import { safeString } from '../../_shared/safety';

@Injectable()
export class FunctionRepository {

    constructor(protected sql: TypeOrmHelper) {
    }

    @LogErrors()
    async transferJobFamilyAndSubFamily(clientId: number): Promise<void> {
        await this.sql.query(`
                exec SuccessProfile.dbo.transfer_Client_JobFamilySubFamily_toSuccessProfile
                    :ClientId
            `,
            {
                ClientId: toNumber(clientId)
            }
        );
    }

    @LogErrors()
    async updateFamilyStatus(query: UpdateFamilyStatusQuery, type: string, body: FamilyStatusBody): Promise<{ status: string }> {
        await this.sql.query(`
                DECLARE @tablevar TABLE (
                    ItemModificationID BIGINT
                )
                INSERT INTO
                    CMM.dbo.ItemModificationSubCategory (
                        ItemType,
                        CompetencyModelGUID,
                        CompetencyModelVersion,
                        LCID,
                        ClientID,
                        ModifiedBy,
                        InsertDate,
                        ModificationComplete
                    )
                OUTPUT INSERTED.ItemModificationID INTO @tablevar
                VALUES (
                    :FamilyType,
                    :ModelId,
                    :ModelVersion,
                    :PreferredLocale,
                    :PreferredClientId,
                    :LoggedInUserClientId,
                    :InsertDate,
                    :ModificationComplete
                )

                SELECT
                    ItemModificationID AS ItemID
                FROM
                    @tablevar
            `,
            {
                FamilyType: FAMILY_TYPE[type],
                ModelId: toStringOr(query.modelId),
                ModelVersion: query.modelVersion,
                PreferredLocale: toLocale(query.preferredLocale),
                PreferredClientId: toNumber(query.preferredClientId),
                LoggedInUserClientId: toNumber(query.loggedInUserClientId),
                InsertDate: moment().format('YYYY-MM-DD h:mm:ss.SSS'),
                ModificationComplete: 0,
            }
        );

        const [status] = await this.sql.query(`
                USE CMM

                SELECT
                    case
                        when cnt >0
                        then 'MODIFIED'
                        else 'PUBLISHED'
                    end as Modification
                FROM (
                    select
                        COUNT(1) AS cnt
                    from
                        CMM.dbo.ItemModificationSubCategory
                    where
                        ClientID = :ClientID
                            AND
                        ItemType in ('SUB_FAMILY', 'FAMILY')
                            AND
                        ModificationComplete = :ModificationComplete
                ) A
            `,
            {
                ClientID: toNumber(query.preferredClientId),
                ModificationComplete: 0,
            }
        );

        await this.sql.query(`
                UPDATE
                    CMM.dbo.${ FAMILY_TYPE[type] === FAMILY_TYPE.families ? 'JobFamily' : 'JobSubFamily' }
                SET
                    DisplayFlagID = :DisplayFlagID,
                    ModifiedBy = :ModifiedBy,
                    IsActive = :IsActive
                WHERE
                    FamilySubFamilyModelGUID = :ModelID
                        AND
                    JobFamilyID = :JobFamilyID
            `,
            {
                DisplayFlagID: 1,
                ModifiedBy: toNumber(query.loggedInUserClientId),
                IsActive: toBit(body[type][0]?.isActive),
                ModelID: toStringOr(query.modelId),
                JobFamilyID: toStringOr(body[type][0].id),
            }
        );

        return {
            status: status.Modification,
        };
    }

    @LogErrors()
    async getProfileStats(query: ProfileStatsQuery): Promise<ProfileStats[]> {
        return await this.sql.query(`
                exec CMM.dbo.Get_ProfileCreatedByCount_byFamilySubFamily
                    @InputClientId = :clientId,
                    @InputJobFamilyID = :jobFamilyId,
                    @InputSubJobFamilyID = :jobSubFamilyId
            `,
            {
                clientId: toNumber(query.preferredClientId),
                jobFamilyId: toStringOr(query.jobFamilyId),
                jobSubFamilyId: toStringOr(query?.jobSubFamilyId)
            }
        );
    }

    @LogErrors()
    async addJobFamily(query: UpdateFamilyStatusQuery, body: JobFamily): Promise<AddJobFamilyResponse[]> {
        let validateJobFamilyResponse: AddJobFamilyResponse[] = await this.validateJobFamilyName(query, body);
        if (validateJobFamilyResponse.length <= 0) {
            await this.sql.query(`
                    exec CMM.dbo.addJobFamily
                        @FamilySubFamilyModelGUID = :FamilySubFamilyModelGUID,
                        @NewJobFamilyName = :NewJobFamilyName,
                        @OldJobFamilyID = :OldJobFamilyID,
                        @CreatedBy = :CreatedBy,
                        @NewJobFamilyDesc = :NewJobFamilyDesc,
                        @LCID = :LCID
                `,
                {
                    FamilySubFamilyModelGUID: toStringOr(query.modelId),
                    NewJobFamilyName: toStringOr(body.families.name),
                    OldJobFamilyID: toStringOr(body.families.kfJobFamilyId),
                    CreatedBy: toNumber(query.userId),
                    NewJobFamilyDesc: toStringOr(body.families.description),
                    LCID: toLocale(query.preferredLocale) || toLocale(query.locale),
                }
            );
            return this.addJobFamilyResponse(query, body)
        }
    }

    @LogErrors()
    async updatefamilysubfamily(query: UpdateFamilyStatusQuery, body: FunctionsSubfunctionsPayloadObj): Promise<FamilySubFamilyModel[]> {
        await this.sql.query(`
                exec CMM.dbo.AddUpdateJobSubFamily
                    @FamilySubFamilyModelGUID = :modelId
            `,
            {
                modelId: toStringOr(query.modelId)
            }
        );

        return await this.sql.query(`
                exec CMM.dbo.Get_FamilySubFamilyModel
                    @InputModel = :modelId,
                    @InputModelVersion = :modelVersion,
                    @InputLCID = :locale,
                    @InputFamilyID = :familyId,
                    @JobSectionCode = null
            `,
            {
                modelId: toStringOr(query.modelId),
                modelVersion: toStringOr(query.modelVersion),
                locale: toLocale(query.preferredLocale),
                familyId: toStringOr(body.families[0].id),
            }
        );
    }

    @LogErrors()
    async updateFunctionsSubFunctions(query: UpdateFamilyStatusQuery): Promise<void> {
        await this.sql.query(`
                exec CMM.dbo.AddUpdateJobSubFamily
                    @FamilySubFamilyModelGUID = :ModelId
            `,
            {
                ModelId: toStringOr(query.modelId)
            }
        );
    }

    @LogErrors()
    protected async validateJobFamilyName(query: UpdateFamilyStatusQuery, body: JobFamily): Promise<AddJobFamilyResponse[]> {
        return await this.sql.query(`
                USE CMM

                DECLARE @tablevar TABLE (
                    JobFamilyID NVARCHAR(20),
                    JobFamilyName NVARCHAR (120),
                    isCustom INT,
                    LCID NVARCHAR(20)
                )

                DECLARE @tmpfamily TABLE (
                    JobFamilyID NVARCHAR(50),
                    JobFamilyName NVARCHAR(MAX)
                )

                DECLARE
                    @InClientID INT,
                    @stdFamilySubFamilyModelID INT,
                    @custFamilySubFamilyModelID INT,
                    @InputLCID NVARCHAR(10);

                DECLARE @modelId NVarchar(MAX) = :ModelId;

                SELECT
                    @InClientID = ClientID,
                    @custFamilySubFamilyModelID = FamilySubFamilyModelID
                FROM
                    CMM.dbo.familysubfamilymodel
                WHERE
                    FamilySubFamilyModelGUID = @modelId

                SELECT
                    @stdFamilySubFamilyModelID = CMMFamilySubfamilyModelID
                FROM
                    SuccessProfile.dbo.ClientStandardModelMapping
                WHERE
                    clientid = @InClientID
                        and
                    isactive = 1;

                INSERT INTO
                    @tablevar
                VALUES (
                    'NULL',
                    :JobFamilyName,
                    1,
                    :LCID
                )

                SELECT TOP 1
                    @Inputlcid = LCID
                FROM
                    @tablevar

                INSERT INTO
                    @tmpfamily
                SELECT
                    jfsfc.JobFamilyID,
                    COALESCE(
                        custjft.JobFamilyName,
                        jft.JobFamilyName,
                        jfsfc.JobFamilyName
                    ) AS JobFamilyName
                FROM (
                    SELECT
                        *
                    FROM
                        CMM.dbo.FamilySubFamilyModel
                    WHERE
                        ClientID = @InClientID
                ) fsfm
                INNER JOIN (
                    SELECT
                        *
                    FROM
                        JobFamily
                    WHERE
                        DisplayFlagID = 1
                            AND
                        FamilySubFamilyModelID = @custFamilySubFamilyModelID
                            AND
                        (
                            ISNULL(LCID, @InputLCID) = @InputLCID
                                OR
                            LEN(JobFamilyId) = 2
                        )
                            AND
                        IsActive < 2
                ) jfsfc
                    ON
                        fsfm.FamilySubFamilyModelID = jfsfc.FamilySubFamilyModelID
                LEFT JOIN
                    JobFamilyTranslations custjft
                        ON
                            custjft.FamilySubFamilyModelID = @custFamilySubFamilyModelID
                                AND
                            custjft.JobFamilyId = jfsfc.JobFamilyID
                                AND
                            custjft.LCID = @InputLCID
                LEFT JOIN
                    JobFamilyTranslations jft
                        ON
                            jft.FamilySubFamilyModelID = @stdFamilySubFamilyModelID
                                AND
                            jft.JobFamilyId = jfsfc.JobFamilyID
                                AND
                            jft.LCID = @InputLCID

                SELECT
                    t1.JobFamilyID,
                    t1.JobFamilyName
                FROM
                    @tablevar t1
                INNER JOIN
                    @tmpfamily tmp
                        ON
                            t1.jobfamilyname = tmp.jobfamilyname
                WHERE
                    tmp.jobfamilyid <> t1.jobfamilyid
            `,
            {
                ModelId: toStringOr(query.modelId),
                JobFamilyName: toStringOr(body.families?.name, 'NULL'),
                LCID: toLocale(query.preferredLocale),
            }
        );
    }

    @LogErrors()
    protected async addJobFamilyResponse(query: UpdateFamilyStatusQuery, body: JobFamily): Promise<AddJobFamilyResponse[]> {
        return await this.sql.query(`
                USE CMM

                SELECT
                    JF.JobFamilyID,
                    JF.JobFamilyName,
                    JF.JobFamilyDescription,
                    JF.IsCustom,
                    JF.DisplayFlagID,
                    JF.ParentFamilyID
                FROM
                    CMM.dbo.JobFamily JF
                WHERE
                    1=1
                        AND
                    JF.FamilySubFamilyModelGUID = :FamilySubFamilyModelGUID
                        AND
                    ISNULL(JF.ParentFamilyID, 'XX') = ISNULL(:ParentFamilyID, 'XX')
                        AND
                    JF.JobFamilyName = :JobFamilyName
                        AND
                    ISNULL(JF.LCID, 'en') = :LCID
                UNION
                SELECT
                    JF.JobFamilyID,
                    JF.JobFamilyName,
                    JF.JobFamilyDescription,
                    1 AS IsCustom,
                    JF.DisplayFlagID,
                    JF.ParentFamilyID
                FROM
                    CMM.dbo.JobFamily JF
                INNER JOIN (
                    SELECT
                        *
                    FROM
                        CMM.dbo.FamilySubFamilyModel
                    WHERE
                        FamilySubFamilyModelguid = :FamilySubFamilyModelGUID
                            AND
                        IsActive = 1
                ) CustFamily
                    ON
                        CustFamily.FamilySubFamilyModelID = JF.FamilySubFamilyModelID
                INNER JOIN
                    CMM.dbo.JobFamilyTranslations JFT
                        ON
                            JF.JobFamilyID = JFT.JobFamilyID
                                AND
                            JFT.FamilySubFamilyModelID = JF.FamilySubFamilyModelID
                WHERE
                    1=1
                        AND
                    JF.FamilySubFamilyModelID = JFT.FamilySubFamilyModelID
                        AND
                    JFT.JobFamilyName = :JobFamilyName
                        AND
                    JFT.LCID = :LCID
                ORDER BY
                    JF.JobFamilyName ASC
            `,
            {
                FamilySubFamilyModelGUID: toStringOr(query.modelId),
                JobFamilyName: toStringOr(body.families?.name),
                ParentFamilyID: toStringOr(body.families?.kfJobFamilyId),
                FamilyDescription: toStringOr(body.families?.description),
                LCID: toLocale(query.preferredLocale) || toLocale(query.locale),
            }
        );
    }

    @LogErrors()
    async getJobFamilies(query: GetJobFamilyQuery): Promise<GetJobFamilyResponse[]> {
        return await this.sql.query(`
                USE SuccessProfile

                declare
                    @ClientID BigInt,
                    @UserID bigInt,
                    @LCID nvarchar(20),
                    @ModelID Int

                Set @ClientID =:ClientID
                Set @LCID =:LCID
                Set @UserID =:UserID

                Select
                    @ModelID = JobdescriptionModelID
                from
                    SuccessProfile.dbo.ClientStandardModelMapping
                Where
                    ClientID = @ClientID
                        and
                    IsActive = 1

                IF (
                    'Fonterra' IN (SELECT ClientName from SuccessProfile.dbo.Client where ClientID = @ClientID)
                )
                    SELECT
                        JF.JobFamilyID,
                        COALESCE(
                            JFT.Name,
                            JFTEN.Name
                        ) JobFamilyName,
                        COALESCE(
                            JFT.description,
                            JFTEN.Description
                        ) JobFamilyDescription,
                        JSF.JobSubFamilyID,
                        COALESCE(
                            JSFT.Name,
                            JSFTEN.Name
                        ) JobSubFamilyName,
                        COALESCE(
                            JSFT.description,
                            JSFTEN.Description
                        ) JobSubFamilyDescription,
                        JRT.JobRoleTypeID,
                        JRTT.Name JobRoleTypeName,
                        JRTT.description JobRoleTypeDescription,
                        JRT.MinimumLevel MinimumPoints,
                        JRT.MaximumLevel MaximumPoints
                    FROM
                        (
                            SELECT
                                JobDescriptionModelID
                            FROM
                                SuccessProfile.dbo.JobDescriptionModel
                            WHERE
                                ClientID = @ClientID
                        ) AS JDM
                    INNER JOIN
                        (
                            Select
                                *
                            from
                                SuccessProfile.dbo.JobFamily
                            where
                                DisplayFlagID = 1
                                    and
                                IsActive = 1
                        ) AS JF
                            ON
                                JF.JobDescriptionModelID = JDM.JobDescriptionModelID
                    INNER JOIN
                        SuccessProfile.dbo.JobFamilyTranslations JFTEN
                            ON
                                JF.JobFamilyID = JFTEN.JobFamilyID
                                    AND
                                JFTEN.LCID = 'en'
                                    AND
                                JF.JobDescriptionModelID = JFTEN.JobDescriptionModelID
                    LEFT JOIN
                        SuccessProfile.dbo.JobFamilyTranslations JFT
                            ON
                                JF.JobFamilyID = JFT.JobFamilyID
                                    AND
                                JFT.LCID = @LCID
                                    AND
                                JF.JobDescriptionModelID = JFT.JobDescriptionModelID
                    INNER JOIN
                        (
                            SELECT
                                *
                            FROM
                                SuccessProfile.dbo.JobSubFamily
                            where
                                DisplayFlagID = 1
                                    and
                                IsActive = 1
                        ) JSF
                            ON
                                JF.JobFamilyID = JSF.JobFamilyID
                                    AND
                                JDM.JobDescriptionModelID = JSF.JobDescriptionModelID
                    INNER JOIN
                        SuccessProfile.dbo.JobSubFamilyTranslations JSFTEN
                            ON
                                JSF.JobSubFamilyID = JSFTEN.JobSubFamilyID
                                    AND
                                JSFTEN.LCID = 'en'
                                    AND
                                JSF.JobDescriptionModelID = JSFTEN.JobDescriptionModelID
                    LEFT JOIN
                        SuccessProfile.dbo.JobSubFamilyTranslations JSFT
                            ON
                                JSF.JobSubFamilyID = JSFT.JobSubFamilyID
                                    AND
                                JSFT.LCID = @lcid
                                    AND
                                JSF.JobDescriptionModelID = JSFT.JobDescriptionModelID
                    JOIN
                        SuccessProfile.dbo.JobRoleType JRT
                            ON
                                JSF.JobSubFamilyID = JRT.JobSubFamilyID
                                    and
                                JRT.GradeScale != 0.000000
                    JOIN
                        SuccessProfile.dbo.JobRoleTypeTranslations JRTT
                            ON
                                JRT.JobRoleTypeId = JRTT.JobRoleTypeId
                                    AND
                                JRTT.LCID = @LCID
                    ORDER BY
                        JobFamilyName,
                        JobSubFamilyName,
                        MaximumPoints desc

                ELSE

                    SELECT
                    JF.JobFamilyID,
                    COALESCE(
                        JFT.Name,
                        JFTEN.Name
                    ) JobFamilyName,
                    COALESCE(
                        JFT.description,
                        JFTEN.Description
                    ) JobFamilyDescription,
                    JSF.JobSubFamilyID,
                    COALESCE(
                        JSFT.Name,
                        JSFTEN.Name
                    ) JobSubFamilyName,
                    COALESCE(
                        JSFT.description,
                        JSFTEN.Description
                    ) JobSubFamilyDescription,
                    JRT.JobRoleTypeID,
                    JRTT.Name JobRoleTypeName,
                    JRTT.description JobRoleTypeDescription,
                    JRT.MinimumLevel MinimumPoints,
                    JRT.MaximumLevel MaximumPoints
                FROM
                    (
                        SELECT
                            JobDescriptionModelID
                        FROM
                            SuccessProfile.dbo.JobDescriptionModel
                        WHERE
                            ClientID = 0
                                and
                            JobDescriptionModelID = @ModelID
                    ) AS JDM
                INNER JOIN
                    (
                        Select
                            *
                        from
                            SuccessProfile.dbo.JobFamily
                        where
                            DisplayFlagID = 1
                                and
                            IsActive = 1
                    ) AS JF
                        ON
                            JF.JobDescriptionModelID = JDM.JobDescriptionModelID
                INNER JOIN
                    SuccessProfile.dbo.JobFamilyTranslations JFTEN
                        ON
                            JF.JobFamilyID = JFTEN.JobFamilyID
                                AND
                            JFTEN.LCID = 'en'
                                AND
                            JF.JobDescriptionModelID = JFTEN.JobDescriptionModelID
                LEFT JOIN
                    SuccessProfile.dbo.JobFamilyTranslations JFT
                        ON
                            JF.JobFamilyID = JFT.JobFamilyID
                                AND
                            JFT.LCID = @LCID
                                AND
                            JF.JobDescriptionModelID = JFT.JobDescriptionModelID
                INNER JOIN
                    (
                        SELECT
                            *
                        FROM
                            SuccessProfile.dbo.JobSubFamily
                        where
                            DisplayFlagID = 1
                                and
                            IsActive = 1
                    ) JSF
                        ON
                            JF.JobFamilyID = JSF.JobFamilyID
                                AND
                            JDM.JobDescriptionModelID = JSF.JobDescriptionModelID
                INNER JOIN
                    SuccessProfile.dbo.JobSubFamilyTranslations JSFTEN
                        ON
                            JSF.JobSubFamilyID = JSFTEN.JobSubFamilyID
                                AND
                            JSFTEN.LCID = 'en'
                                AND
                            JSF.JobDescriptionModelID = JSFTEN.JobDescriptionModelID
                LEFT JOIN
                    SuccessProfile.dbo.JobSubFamilyTranslations JSFT
                        ON
                            JSF.JobSubFamilyID = JSFT.JobSubFamilyID
                                AND
                            JSFT.LCID = @lcid
                                AND
                            JSF.JobDescriptionModelID = JSFT.JobDescriptionModelID
                LEFT JOIN
                    SuccessProfile.dbo.JobRoleType JRT
                        ON
                            JSF.JobSubFamilyID = JRT.JobSubFamilyID
                                and
                            JRT.GradeScale != 0.000000
                LEFT JOIN
                    SuccessProfile.dbo.JobRoleTypeTranslations JRTT
                        ON
                            JRT.JobRoleTypeId = JRTT.JobRoleTypeId
                                AND
                            JRTT.LCID = @LCID
                WHERE
                    JF.JobFamilyID NOT LIKE 'RR%'
                ORDER BY
                    JobFamilyID,
                    JobSubFamilyName,
                    MaximumPoints desc

            `,
            {
                ClientID: toNumber(query.loggedInUserClientId),
                LCID: toLocale(query.preferredLocale),
                UserID: toNumber(query.userId),
            }
        );
    }

    @LogErrors()
    async getJobFamilyNameValidation(query: UpdateFamilyStatusQuery, body: FunctionsSubfunctionsPayloadObj): Promise<FamilesValidation[]> {
        if (!body?.families?.length) {
            throw 'Families property is not provided in body payload.';
        }
        const family = body.families[0];

        return await this.sql.query(`
                USE CMM

                DECLARE @tablevar TABLE (
                    JobFamilyID NVARCHAR(20),
                    JobFamilyName NVARCHAR (120),
                    isCustom INT,
                    LCID NVARCHAR(20)
                )

                DECLARE @tmpfamily TABLE (
                    JobFamilyID NVARCHAR(50),
                    JobFamilyName NVARCHAR(MAX)
                )

                DECLARE
                    @InClientID INT,
                    @stdFamilySubFamilyModelID INT,
                    @custFamilySubFamilyModelID INT,
                    @InputLCID NVARCHAR(10)
                ;

                DECLARE
                    @modelId NVarchar(MAX) = :ModelId
                ;

                SELECT
                    @InClientID = ClientID,
                    @custFamilySubFamilyModelID = FamilySubFamilyModelID
                FROM
                    CMM.dbo.familysubfamilymodel
                WHERE
                    FamilySubFamilyModelGUID = @modelId

                SELECT
                    @stdFamilySubFamilyModelID = CMMFamilySubfamilyModelID
                FROM
                    SuccessProfile.dbo.ClientStandardModelMapping
                WHERE
                    clientid = @InClientID
                        and
                    isactive = 1;

                INSERT INTO @tablevar VALUES (
                    :FamilyId,
                    :FamilyName,
                    :isCustom,
                    :LCID
                )

                SELECT TOP 1
                    @Inputlcid = LCID
                FROM
                    @tablevar

                INSERT INTO @tmpfamily
                SELECT
                    jfsfc.JobFamilyID,
                    COALESCE(
                        custjft.JobFamilyName,
                        jft.JobFamilyName,
                        jfsfc.JobFamilyName
                    ) AS JobFamilyName
                FROM
                    (
                        SELECT
                            *
                        FROM
                            CMM.dbo.FamilySubFamilyModel
                        WHERE
                            ClientID = @InClientID
                    ) fsfm
                INNER JOIN
                    (
                        SELECT
                            *
                        FROM
                            CMM.dbo.JobFamily
                        WHERE
                            DisplayFlagID = 1
                                AND
                            FamilySubFamilyModelID = @custFamilySubFamilyModelID
                                AND
                            (
                                ISNULL(LCID, @InputLCID) = @InputLCID
                                    OR
                                LEN(JobFamilyId) = 2
                            )
                                AND
                            IsActive < 2
                    ) jfsfc
                        ON
                            fsfm.FamilySubFamilyModelID = jfsfc.FamilySubFamilyModelID
                LEFT JOIN
                    CMM.dbo.JobFamilyTranslations custjft
                    ON
                        custjft.FamilySubFamilyModelID = @custFamilySubFamilyModelID
                            AND
                        custjft.JobFamilyId = jfsfc.JobFamilyID
                            AND
                        custjft.LCID = @InputLCID
                LEFT JOIN
                    CMM.dbo.JobFamilyTranslations jft
                        ON
                            jft.FamilySubFamilyModelID = @stdFamilySubFamilyModelID
                                AND
                            jft.JobFamilyId = jfsfc.JobFamilyID
                                AND
                            jft.LCID = @InputLCID

                SELECT
                    t1.JobFamilyID,
                    t1.JobFamilyName
                FROM
                    @tablevar t1
                INNER JOIN
                    @tmpfamily tmp
                        ON
                            t1.jobfamilyname = tmp.jobfamilyname
                WHERE
                    tmp.jobfamilyid <> t1.jobfamilyid
            `,
            {
                FamilyId: toStringOr(family?.id),
                FamilyName: toStringOr(family?.name, 'NULL'),
                isCustom: toBit(family?.isCustom),
                ModelId: toStringOr(query.modelId),
                LCID: toLocale(query.preferredLocale),
            }
        );
    }

    @LogErrors()
    async getJobSubFamilyValidation(
        query: UpdateFamilyStatusQuery,
        family: FunctionsSubfunctionsPayload,
        subFamilies: FunctionSubFamilies[],
    ): Promise<SubFamilesValidation[]> {

        const valuesSubQuery: string[] = [];
        const params: ParamsObj = {
            modelId: query.modelId,
        };
        let index = 0;

        for (const subFamily of subFamilies || []) {
            valuesSubQuery.push(`
                (
                    :FamilyId${index},
                    :SubFamilyId${index},
                    :SubFamilyName${index},
                    :Custom${index},
                    :LCID${index}
                )
            `);
            Object.assign(params, {
                [`FamilyId${index}`]: family.id,
                [`SubFamilyId${index}`]: subFamily.id || null,
                [`SubFamilyName${index}`]: subFamily?.name || null,
                [`Custom${index}`]: toBit(subFamily.isCustom),
                [`LCID${index}`]: toLocale(query.preferredLocale) || 'en',
            } as Partial<ParamsObj>);
            index++;
        }

        return await this.sql.query(`
                use CMM;

                DECLARE @tablevar TABLE (
                    JobFamilyID NVARCHAR(20),
                    JobSubFamilyID NVARCHAR(20),
                    JobSubFamilyName NVARCHAR (120),
                    isCustom INT,
                    LCID nvarchar(20)
                )
                DECLARE @tmpJobSubFamily TABLE (
                    JobFamilyID NVARCHAR(20),
                    JobSubFamilyID NVARCHAR(20),
                    JobSubFamilyName NVARCHAR (120)
                )
                DECLARE
                    @InClientID INT,
                    @stdFamilySubFamilyModelID INT,
                    @custFamilySubFamilyModelID INT,
                    @InputLCID NVARCHAR(10)
                ;
                DECLARE
                    @modelId NVarchar(max) = :modelId

                SELECT
                    @InClientID = ClientID,
                    @custFamilySubFamilyModelID = FamilySubFamilyModelID
                FROM
                    CMM.dbo.familysubfamilymodel
                WHERE
                    FamilySubFamilyModelGUID = @modelId

                SELECT
                    @stdFamilySubFamilyModelID = CMMFamilySubfamilyModelID
                FROM
                    SuccessProfile.dbo.ClientStandardModelMapping
                WHERE
                    clientid = @InClientID
                        and
                    isactive = 1
                ;

                INSERT INTO
                    @tablevar
                VALUES
                    ${valuesSubQuery.join(',')}

                SELECT TOP 1
                    @Inputlcid = LCID
                FROM
                    @tablevar

                INSERT INTO
                    @tmpJobSubFamily
                SELECT
                    jfsfc.JobFamilyID,
                    jsf.JobSubFamilyID,
                    COALESCE(
                        custJSFT.JobSubFamilyName,
                        JSFT.JobSubFamilyName,
                        jsf.JobSubFamilyName
                    ) AS JobSubFamilyName
                FROM
                    (
                        SELECT
                            *
                        FROM
                            CMM.dbo.FamilySubFamilyModel
                        WHERE
                            ClientID = @InClientID
                    ) fsfm
                INNER JOIN
                    (
                        SELECT
                            *
                        FROM
                            CMM.dbo.JobFamily
                        WHERE
                            DisplayFlagID = 1
                                AND
                            FamilySubFamilyModelID = @custFamilySubFamilyModelID
                                AND
                            (
                                ISNULL(LCID, @InputLCID) = @InputLCID
                                    OR
                                LEN(JobFamilyId) = 2
                            )
                                AND
                            IsActive < 2
                    ) jfsfc
                        ON
                            fsfm.FamilySubFamilyModelID = jfsfc.FamilySubFamilyModelID
                LEFT JOIN
                    (
                        SELECT
                            *
                        FROM
                            CMM.dbo.JobSubFamily
                        WHERE
                            DisplayFlagID = 1
                                AND
                            FamilySubFamilyModelID = @custFamilySubFamilyModelID
                                AND
                            (
                                ISNULL(LCID, @InputLCID) = @InputLCID
                                    OR
                                LEN(JobSubFamilyId) = 3
                            )
                    ) jsf
                        ON
                            jsf.JobFamilyID = jfsfc.JobFamilyID
                                AND
                            fsfm.FamilySubFamilyModelID = jsf.FamilySubFamilyModelID
                LEFT JOIN
                    CMM.dbo.JobFamilyTranslations custJFT --customized translations
                        ON
                            custJFT.FamilySubFamilyModelID = @custFamilySubFamilyModelID
                                AND
                            custJFT.JobFamilyId = jfsfc.JobFamilyID
                                AND
                            custJFT.LCID = @InputLCID
                LEFT JOIN
                    CMM.dbo.JobFamilyTranslations JFT --standar translations
                        ON
                            JFT.FamilySubFamilyModelID = @stdFamilySubFamilyModelID
                                AND
                            JFT.JobFamilyId = jfsfc.JobFamilyID
                                AND
                            JFT.LCID = @InputLCID
                LEFT JOIN
                    CMM.dbo.JobSubFamilyTranslations custJSFT
                        ON
                            custJSFT.FamilySubFamilyModelID = @custFamilySubFamilyModelID
                                AND
                            custJSFT.JobSubFamilyId = jsf.JobSubFamilyId
                                AND
                            custJSFT.LCID = @InputLCID
                LEFT JOIN
                    CMM.dbo.JobSubFamilyTranslations JSFT
                        ON
                            JSFT.FamilySubFamilyModelID = @stdFamilySubFamilyModelID
                                AND
                            JSFT.JobSubFamilyId = jsf.JobSubFamilyId
                                AND
                            JSFT.LCID = @InputLCID
                ;

                SELECT
                    T1.JobFamilyID,
                    T1.JobSubFamilyID,
                    T1.JobSubFamilyName
                FROM
                    @tablevar T1
                INNER JOIN
                    @tmpJobSubFamily jsf
                        ON
                            T1.JobFamilyID = jsf.JobFamilyID
                                AND
                            T1.JobSubFamilyname = jsf.JobSubFamilyName
                WHERE
                    T1.JobSubFamilyID <> jsf.JobSubFamilyID
                UNION
                SELECT
                    JobFamilyID,
                    JobSubFamilyId,
                    JobSubFamilyName
                FROM
                    @tablevar
                WHERE
                    JobSubFamilyName IN (
                        SELECT
                            JobSubFamilyName
                        FROM
                            @tablevar
                        GROUP BY
                            JobSubFamilyName
                        HAVING
                            COUNT(*) > 1
                    )
            `,
            params
        );
    }

    @LogErrors()
    async getIndustryJobModels(query: JobModelDetailsQueryProps, modelId: string): Promise<JobClientIndustryDbValues[]> {
        return await this.sql.query(`
                exec CMM.dbo.Get_FamilySubFamilyModel
                    @InputModel = :modelId,
                    @InputModelVersion = :modelVersion,
                    @InputLCID	= :locale,
                    @InputFamilyID = null,
                    @JobSectionCode = null
            `,
            {
                modelId: toStringOr(modelId),
                modelVersion: toStringOr(query.modelVersion),
                locale: toLocale(query.preferredLocale),
            }
        );
    }

    @LogErrors()
    async getJobModelDetails(query: JobModelDetailsQueryProps, modelId: string): Promise<FamilySubFamilyModel[]> {
        return await this.sql.query(`
                exec CMM.dbo.Get_FamilySubFamilyModel
                    @InputModel = :modelId,
                    @InputModelVersion = :modelVersion,
                    @InputLCID = :locale,
                    @InputFamilyID = null,
                    @JobSectionCode = :type
            `,
            {
                modelId: toStringOr(modelId),
                modelVersion: toStringOr(query.modelVersion),
                locale: toLocale(query.preferredLocale),
                type: toStringOr(query.type)
            }
        );
    }

    protected async getJobModelDetailsStatusForClientId(clientId: number, modificationComplete: number): Promise<{ status: string }> {
        const [ status ] = await this.sql.query(`
                SELECT
                    case
                        when cnt >0
                        then 'MODIFIED'
                        else 'PUBLISHED'
                    end as Modification
                FROM
                    (
                        select
                            COUNT(1) AS cnt
                        from
                            CMM.dbo.ItemModificationSubCategory
                        where
                            ClientID = :ClientID
                                AND
                            ItemType in ('SUB_FAMILY', 'FAMILY')
                                AND
                            ModificationComplete = :ModificationComplete
                    )A
            `,
            {
                ClientID: toNumber(clientId),
                ModificationComplete: toNumber(modificationComplete),
            }
        );
        return {
            status: status.Modification,
        };
    }

    @LogErrors()
    async getJobModelDetailsStatus(query: JobModelDetailsQueryProps): Promise<{ status: string }> {
        return this.getJobModelDetailsStatusForClientId(query.loggedInUserClientId, 0);
    }

    @LogErrors()
    async getJobModelIndustryDetailsStatus(query: JobModelDetailsQueryProps): Promise<{ status: string }> {
        return this.getJobModelDetailsStatusForClientId(query.loggedInUserClientId, 0);
    }

    @LogErrors()
    async getJobModels(query: JobModelQueryProps): Promise<JobModelDbResponse[]> {
        return await this.sql.query(`
                USE CMM

                DECLARE
                    @ClientID bigint,
                    @isActive tinyint,
                    @LCID nvarchar(20)
                ;

                SET @ClientID = :preferredClientId;
                SET @LCID = :preferredLocale;
                SET @isActive = :isActive;

                SELECT DISTINCT
                    FSFM.FamilySubFamilyModelGUID AS modelId,
                    FSFM.FamilySubFamilyModelVersion AS modelVersion,
                    FSFM.FamilySubFamilyModelName AS modelName,
                    FSFM.FamilySubFamilyModelDescription AS modelDescription,
                    FSFM.isActive,
                    isCustom = '0',
                    outputType = 'FUNCTIONS',
                    @LCID AS locale,
                    LG.localename AS localName,
                    isMaster = '1'
                FROM
                    CMM.dbo.FamilySubFamilyModel FSFM
                LEFT OUTER JOIN
                    CMM.dbo.Languages AS LG
                        ON
                            LG.LCID = FSFM.LCID
                WHERE
                    FSFM.ClientID = :preferredClientId
                        AND
                    FSFM.isActive = :isActive
            `,
            {
                preferredClientId: toNumber(query.preferredClientId),
                preferredLocale: toLocale(query.preferredLocale),
                isActive: 1,
            }
        );
    }

    @LogErrors()
    async modificationJobFamilySubFamily(
        query: UpdateFamilyStatusQuery,
        baseFamily: FunctionsSubfunctionsPayload,
        subFamily: FunctionsSubfunctionsPayload,
        index: number,
    ): Promise<{ status: string }> {
        return await this.sql.query(`
                INSERT INTO
                    CMM.dbo.ItemModificationJobFamilySubFamily (
                        ItemType,
                        FamilySubFamilyModelGUID,
                        JobFamilyID,
                        JobFamilyName,
                        JobFamilyIsCustom,
                        JobSubFamilyID,
                        JobSubFamilyName,
                        JobSubFamilyDescription,
                        JobSubFamilyIsCustom,
                        JobSubFamilyDisplayFlagID,
                        KFFamilyID,
                        ParentSubFamilyID,
                        JobSubFamilyOrder,
                        CreatedBy,
                        ModificationComplete,
                        LCID,
                        JobFamilyDescription
                    )
                VALUES (
                    :ItemType,
                    :FamilySubFamilyModelGUID,
                    :JobFamilyID,
                    :JobFamilyName,
                    :JobFamilyIsCustom,
                    :JobSubFamilyID,
                    :JobSubFamilyName,
                    :JobSubFamilyDescription,
                    :JobSubFamilyIsCustom,
                    :JobSubFamilyDisplayFlagID,
                    :KFFamilyID,
                    :ParentSubFamilyID,
                    :JobSubFamilyOrder,
                    :CreatedBy,
                    :ModificationComplete,
                    :LCID,
                    :JobFamilyDescription
                )
            `,
            {
                ItemType: null,
                FamilySubFamilyModelGUID: query.modelId,
                JobFamilyID: toStringOr(baseFamily.id),
                JobFamilyName: escapeSingleQuote(toStringOr(baseFamily.name)),
                JobFamilyIsCustom: toBit(baseFamily.isCustom),
                JobSubFamilyID: toStringOr(subFamily?.id) || null,
                JobSubFamilyName: escapeSingleQuote(toStringOr(subFamily?.name)),
                JobSubFamilyDescription: escapeSingleQuote(toStringOr(subFamily?.description)),
                JobSubFamilyIsCustom: toBit(subFamily?.isCustom),
                JobSubFamilyDisplayFlagID: null,
                KFFamilyID: toStringOr(baseFamily.id),
                ParentSubFamilyID: toStringOr(baseFamily.id),
                JobSubFamilyOrder: toNumber(index),
                CreatedBy: toNumber(query.userId),
                ModificationComplete: 0,
                LCID: toLocale(query.preferredLocale),
                JobFamilyDescription: escapeSingleQuote(toStringOr(baseFamily.description)),
            } as JobFamilySubFamilyParams
        );
    }

    @LogErrors()
    async insertFunctionSubFunction(
        baseFamily: LanguageFunction,
        subFamily: LanguageSubFunction,
        query: UpdateFamilyStatusQuery,
        index: number,
    ): Promise<{ status: string }> {
        return await this.sql.query(`
                INSERT INTO
                    CMM.dbo.ItemModificationJobFamilySubFamily (
                        ItemType,
                        FamilySubFamilyModelGUID,
                        JobFamilyID,
                        JobFamilyName,
                        JobFamilyIsCustom,
                        JobSubFamilyID,
                        JobSubFamilyName,
                        JobSubFamilyDescription,
                        JobSubFamilyIsCustom,
                        JobSubFamilyDisplayFlagID,
                        KFFamilyID,
                        ParentSubFamilyID,
                        JobSubFamilyOrder,
                        CreatedBy,
                        ModificationComplete,
                        LCID,
                        JobFamilyDescription,
                        IsPrimaryLanguage,
                        UniqueSubFamilyID
                    )
                VALUES (
                    :ItemType,
                    :FamilySubFamilyModelGUID,
                    :JobFamilyID,
                    :JobFamilyName,
                    :JobFamilyIsCustom,
                    :JobSubFamilyID,
                    :JobSubFamilyName,
                    :JobSubFamilyDescription,
                    :JobSubFamilyIsCustom,
                    :JobSubFamilyDisplayFlagID,
                    :KFFamilyID,
                    :ParentSubFamilyID,
                    :JobSubFamilyOrder,
                    :CreatedBy,
                    :ModificationComplete,
                    :LCID,
                    :JobFamilyDescription,
                    :IsPrimaryLanguage,
                    :UniqueSubFamilyID
                )
            `,
            {
                ItemType: null,
                FamilySubFamilyModelGUID: query.modelId,
                JobFamilyID: toStringOr(baseFamily.id),
                JobFamilyName: escapeSingleQuote(toStringOr(baseFamily.name)),
                JobFamilyIsCustom: toBit(baseFamily.isCustom),
                JobSubFamilyID: toStringOr(subFamily?.id) || null,
                JobSubFamilyName: escapeSingleQuote(toStringOr(subFamily?.name)),
                JobSubFamilyDescription: escapeSingleQuote(toStringOr(subFamily?.description)),
                JobSubFamilyIsCustom: toBit(subFamily?.isCustom),
                JobSubFamilyDisplayFlagID: null,
                KFFamilyID: toStringOr(baseFamily.kfJobFamilyId),
                ParentSubFamilyID: toStringOr(subFamily?.kfJobSubFamilyId),
                JobSubFamilyOrder: toNumber(index),
                CreatedBy: toNumber(query.userId),
                ModificationComplete: 0,
                LCID: toLocale(baseFamily.locale),
                JobFamilyDescription: escapeSingleQuote(toStringOr(baseFamily.description)),
                IsPrimaryLanguage: toBoolean(baseFamily.isParent) ? 'Y' : 'N',
                UniqueSubFamilyID: toStringOr(subFamily?.uniqueId) || null,
            } as FamilySubFamilyParams
        );
    }

    @LogErrors()
    async addParentLanguageFunction(families: LanguageFunction[], query: UpdateFamilyStatusQuery): Promise<AddJobFamilyResponse[]> {

        for (let family of families || []) {
            const validation = await this.validateFunction(query.modelId, family);
            if (validation.length) {
                throw new AppError(safeString(`Function name already exists ${validation[0].JobFamilyName}`), 400, { errorCode: ec.FAMILY_DUPLICATE });
            }
        }

        const [parentLanguage] = families.filter(func => func.isParent);

        await this.sql.query(`
                exec CMM.dbo.addJobFamily
                    @FamilySubFamilyModelGUID = :FamilySubFamilyModelGUID,
                    @NewJobFamilyName = :NewJobFamilyName,
                    @OldJobFamilyID = :OldJobFamilyID,
                    @CreatedBy = :CreatedBy,
                    @NewJobFamilyDesc = :NewJobFamilyDesc,
                    @LCID = :LCID
            `,
            {
                FamilySubFamilyModelGUID: query.modelId,
                NewJobFamilyName: toStringOr(parentLanguage.name),
                OldJobFamilyID: toStringOr(parentLanguage.kfJobFamilyId),
                CreatedBy: toNumber(query.userId),
                NewJobFamilyDesc: toStringOr(parentLanguage.description),
                LCID: toLocale(parentLanguage.locale),
            }
        );

        return await this.generateFunctionResponse(query.modelId, parentLanguage);
    }

    @LogErrors()
    protected async generateFunctionResponse(modelId: string, parentLanguage: LanguageFunction): Promise<AddJobFamilyResponse[]> {
        return await this.sql.query(`
                USE CMM

                SELECT
                    JF.JobFamilyID,
                    JF.JobFamilyName,
                    JF.JobFamilyDescription,
                    JF.IsCustom,
                    JF.DisplayFlagID,
                    JF.ParentFamilyID
                FROM
                    CMM.dbo.JobFamily JF
                WHERE
                    1=1
                        AND
                    JF.FamilySubFamilyModelGUID = :FamilySubFamilyModelGUID
                        AND
                    ISNULL(JF.ParentFamilyID, 'XX') = ISNULL(:ParentFamilyID, 'XX')
                        AND
                    JF.JobFamilyName = :JobFamilyName
                        AND
                    ISNULL(JF.LCID, 'en') = :LCID
                UNION
                SELECT
                    JF.JobFamilyID,
                    JF.JobFamilyName,
                    JF.JobFamilyDescription,
                    1 AS IsCustom,
                    JF.DisplayFlagID,
                    JF.ParentFamilyID
                FROM
                    CMM.dbo.JobFamily JF
                INNER JOIN (
                    SELECT
                        *
                    FROM
                        CMM.dbo.FamilySubFamilyModel
                    WHERE
                        FamilySubFamilyModelguid = :FamilySubFamilyModelGUID
                            AND
                        IsActive = 1
                ) CustFamily
                    ON
                        CustFamily.FamilySubFamilyModelID = JF.FamilySubFamilyModelID
                INNER JOIN
                    CMM.dbo.JobFamilyTranslations JFT
                        ON
                            JF.JobFamilyID = JFT.JobFamilyID
                                AND
                            JFT.FamilySubFamilyModelID = JF.FamilySubFamilyModelID
                WHERE
                    1=1
                        AND
                    JF.FamilySubFamilyModelID = JFT.FamilySubFamilyModelID
                        AND
                    JFT.JobFamilyName = :JobFamilyName
                        AND
                    JFT.LCID = :LCID
                ORDER BY
                    JF.JobFamilyName ASC
            `,
            {
                FamilySubFamilyModelGUID: toStringOr(modelId),
                JobFamilyName: toStringOr(parentLanguage.name),
                ParentFamilyID: toStringOr(parentLanguage.kfJobFamilyId),
                FamilyDescription: toStringOr(parentLanguage.description),
                LCID: toLocale(parentLanguage.locale),
            }
        );
    }

    @LogErrors()
    protected async validateFunction(modelId: string, func: LanguageFunction): Promise<FamilesValidation[]> {
        return await this.sql.query(`
                USE CMM

                DECLARE @tablevar TABLE (
                    JobFamilyID NVARCHAR(20),
                    JobFamilyName NVARCHAR (120),
                    isCustom INT,
                    LCID NVARCHAR(20)
                )

                DECLARE @tmpfamily TABLE (
                    JobFamilyID NVARCHAR(50),
                    JobFamilyName NVARCHAR(MAX)
                )

                DECLARE
                    @InClientID INT,
                    @stdFamilySubFamilyModelID INT,
                    @custFamilySubFamilyModelID INT,
                    @InputLCID NVARCHAR(10);

                DECLARE
                    @modelId NVarchar(MAX) = :ModelId;

                SELECT
                    @InClientID = ClientID,
                    @custFamilySubFamilyModelID = FamilySubFamilyModelID
                FROM
                    CMM.dbo.familysubfamilymodel
                WHERE
                    FamilySubFamilyModelGUID = @modelId

                SELECT
                    @stdFamilySubFamilyModelID = CMMFamilySubfamilyModelID
                FROM
                    SuccessProfile.dbo.ClientStandardModelMapping
                WHERE
                    clientid = @InClientID
                        and
                    isactive = 1;

                INSERT INTO
                    @tablevar
                VALUES (
                    'NULL',
                    :funcName,
                    1,
                    :LCID
                )

                SELECT TOP 1
                    @Inputlcid = LCID
                FROM
                    @tablevar

                INSERT INTO
                    @tmpfamily
                SELECT
                    jfsfc.JobFamilyID,
                    COALESCE(
                        custjft.JobFamilyName,
                        jft.JobFamilyName,
                        jfsfc.JobFamilyName
                    ) AS JobFamilyName
                FROM (
                    SELECT
                        *
                    FROM
                        CMM.dbo.FamilySubFamilyModel
                    WHERE
                        ClientID = @InClientID
                ) fsfm
                INNER JOIN (
                    SELECT
                        *
                    FROM
                        JobFamily jf
                    WHERE
                        DisplayFlagID = 1
                            AND
                        FamilySubFamilyModelID = @custFamilySubFamilyModelID
                            AND
                        (
                            ISNULL(LCID, @InputLCID) = @InputLCID
                                OR
                            LEN(JobFamilyId) = 2
                        )
                            AND
                        IsActive < 2
                            OR
                        EXISTS (
                            SELECT
                                1
                            FROM
                                CMM.dbo.jobfamilytranslations jft
                            WHERE
                                FamilySubFamilyModelID = @custFamilySubFamilyModelID
                                    AND
                                jf.jobfamilyid = jft.jobfamilyid
                                    and
                                jft.lcid = @inputlcid
                        )
                ) jfsfc
                    ON
                        fsfm.FamilySubFamilyModelID = jfsfc.FamilySubFamilyModelID
                LEFT JOIN
                    JobFamilyTranslations custjft
                        ON
                            custjft.FamilySubFamilyModelID = @custFamilySubFamilyModelID
                                AND
                            custjft.JobFamilyId = jfsfc.JobFamilyID
                                AND
                            custjft.LCID = @InputLCID
                LEFT JOIN
                    JobFamilyTranslations jft
                        ON
                            jft.FamilySubFamilyModelID = @stdFamilySubFamilyModelID
                                AND
                            jft.JobFamilyId = jfsfc.JobFamilyID
                                AND
                            jft.LCID = @InputLCID

                SELECT
                    t1.JobFamilyID,
                    t1.JobFamilyName
                FROM
                    @tablevar t1
                INNER JOIN
                    @tmpfamily tmp
                        ON
                            t1.jobfamilyname = tmp.jobfamilyname
                WHERE
                    tmp.jobfamilyid <> t1.jobfamilyid

            `,
            {
                ModelId: toStringOr(modelId),
                funcName: toStringOr(func.name),
                LCID: toLocale(func.locale),
            }
        );
    }

}
