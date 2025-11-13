import {
    AddJobLevelDetailDBResponse,
    AddJobSubCategoryDBResponse,
    ClientSettingsRawDBResponse,
    DescriptionDBResponse,
    GetDependentSubCategoryDBResponse,
    GetResponsibilityDetailIdDBResponse,
    GetResponsibilityModelQuery,
    GetSuccessProfileDescriptionsDBResponse,
    GetUserLocaleDBResponse,
    ItemModificationSubCategoryDBResponse,
    JobLevel,
    ModelDBResponse,
    ModelQuery,
    NewJobSubCategory,
    NewModelDBResponse,
    OldModelDBResponse,
    ResponsibilityDescriptionQuery,
    SearchCategoriesRawDBResponse,
    SubcategoryType,
    UpdateResponsibilityQuery,
    UserSelectedRawDBResponse,
} from './responsibilities.interface';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { Injectable } from '@nestjs/common';
import { toLocale, toNumber, toStringOr } from '../../_shared/convert';
import { TypeOrmHelper } from '../../_shared/db/typeorm.helper';

@Injectable()
export class ResponsibilitiesRepository {

    constructor(
        protected sql: TypeOrmHelper,
    ) {
    }

    @LogErrors()
    async getOldModelResponsibilities(query: ModelQuery, modelId: string): Promise<OldModelDBResponse[]> {
        return await this.sql.query(`
                exec CMM.dbo.GetClientCategories
                    @InputModelGUID = :ModelId,
                    @InputModelVersion = :ModelVersion,
                    @LCID = :LCID,
                    @JobSectionCode = :JobSectionCode,
                    @ClientID = :ClientId
            `,
            {
                ModelId: modelId,
                ModelVersion: toStringOr(query.modelVersion),
                LCID: toLocale(query.preferredLocale),
                JobSectionCode: toStringOr(query.outputType),
                ClientId: toNumber(query.preferredClientId),
            }
        );
    }

    @LogErrors()
    async getNewModelResponsibilities(query: ModelQuery, modelId: string): Promise<NewModelDBResponse[]> {
        return await this.sql.query(`
                exec CMM.dbo.Get_RespSkillModel
                    @InputModelGUID = :ModelId,
                    @InputModelVersion = :ModelVersion,
                    @LCID = :LCID,
                    @JobSectionCode = :JobSectionCode,
                    @ClientID = :ClientId
            `,
            {
                ModelId: modelId,
                ModelVersion: toStringOr(query.modelVersion),
                LCID: toLocale(query.preferredLocale),
                JobSectionCode: toStringOr(query.outputType),
                ClientId: toNumber(query.preferredClientId),
            }
        );
    }

    @LogErrors()
    async getResponsibilitiesStatus(query: ModelQuery): Promise<[{ Modification: string }]> {
        return await this.sql.query(`
                SELECT
                    case
                        when cnt > 0
                        then 'MODIFIED'
                        else 'PUBLISHED'
                    end as Modification
                FROM (
                    select
                        COUNT(1) AS cnt
                    from
                        CMM.dbo.ItemModificationSubCategory
                    where
                        ClientID = :ClientId
                            AND
                        ItemType = :ItemType
                            AND
                        ModificationComplete = 0
                ) A
            `,
            {
                ClientId: toNumber(query.preferredClientId),
                ItemType: toStringOr(query.outputType),
            }
        );
    }

    @LogErrors()
    async getResponsibilitiesModels(query: GetResponsibilityModelQuery): Promise<ModelDBResponse[]> {
        return await this.sql.query(`
                use CMM;
                SELECT
                    JDM.JobDescriptionModelGUID AS CompetencyModelGUID,
                    JDM.JobDescriptionModelVersion AS CompetencyModelVersion,
                    JDM.JobDescriptionModelname AS CompetencyModelName,
                    JDM.JobDescriptionModelDescription AS CompetencyModelDescription,
                    ClientID,
                    LCID = :LCID,
                    L.LocaleName,
                    1 MasterCompetencyModel,
                    'KFLA' CompetencyModelTemplateName,
                    'KFLA' CompetencyModelParentType,
                    JDM.IsActive,
                    1 IsCustomCompetencyModel
                FROM
                    CMM.dbo.JobDescriptionModel AS JDM
                INNER JOIN
                    CMM.dbo.JobDescriptionModelItems AS JDMI
                        ON
                            JDM.JobDescriptionModelID = JDMI.JobDescriptionModelID
                INNER JOIN
                    CMM.dbo.Language AS L
                        ON
                            JDM.LCID = L.LCID
                WHERE
                    JDM.ClientID = :ClientId
                        AND
                    JDM.IsActive = 1
                        AND
                    JDMI.JobSectionCode = :TechnicalSkills
            `,
            {
                LCID: toLocale(query.preferredLocale),
                ClientId: toNumber(query.preferredClientId),
                TechnicalSkills: SubcategoryType.TECHNICAL_SKILLS,
            }
        );
    }

    @LogErrors()
    async getResponsibilityModelDetailId(query: GetResponsibilityModelQuery, id: number): Promise<GetResponsibilityDetailIdDBResponse[]> {
        return await this.sql.query(`
                exec CMM.dbo.GetOneSubCategoryWithLevels
                    @ClientId = :ClientId,
                    @LCID = :LCID,
                    @JobSubCategoryID = :JobSubCategoryId
            `,
            {
                ClientId: toNumber(query.preferredClientId),
                LCID: toLocale(query.preferredLocale),
                JobSubCategoryId: toNumber(id),
            }
        );
    }

    @LogErrors()
    async responsibilitiesPublish(clientId: number, jobSectionCode: SubcategoryType): Promise<void> {
        return await this.sql.query(`
                exec SuccessProfile.dbo.transfer_Client_JDModelItems_toSuccessProfile
                    :clientId,
                    :jobSectionCode
            `,
            {
                clientId: toNumber(clientId),
                jobSectionCode
            }
        );
    }

    @LogErrors()
    async itemModificationSubCategory(type:SubcategoryType, query: UpdateResponsibilityQuery, timeStamp: string): Promise<ItemModificationSubCategoryDBResponse[]> {
        return await this.sql.query(`
                DECLARE @tablevar TABLE (
                    ItemModificationID BIGINT
                )
                insert into CMM.dbo.ItemModificationSubCategory (
                    ItemType,
                    CompetencyModelGUID,
                    CompetencyModelVersion,
                    LCID,
                    ClientID,
                    ModifiedBy,
                    InsertDate,
                    ModificationComplete
                )
                OUTPUT
                    INSERTED.ItemModificationID
                INTO
                    @tablevar
                values (
                    :Type,
                    :ModelId,
                    :ModelVersion,
                    :LCID,
                    :ClientId,
                    :UserID,
                    :TimeStamp,
                    0
                )
                SELECT
                    ItemModificationID AS ItemID
                FROM
                    @tablevar
            `,
            {
                Type: toStringOr(type),
                ModelId: toStringOr(query.modelId),
                ModelVersion: toStringOr(query.modelVersion),
                LCID: toLocale(query.preferredLocale),
                ClientId: toNumber(query.preferredClientId),
                UserID: toNumber(query.userId),
                TimeStamp: timeStamp,
            }
        );
    }

    @LogErrors()
    async addJobSubCategory(jobSubCategoryDetail: NewJobSubCategory): Promise<AddJobSubCategoryDBResponse[]> {
        return await this.sql.query(`
                exec CMM.dbo.AddJobSubCategory
                    @JobCategoryID = :JobCategoryID,
                    @JobSubCategoryName = :JobSubCategoryName,
                    @JobSubCategoryDescription = :JobSubCategoryDescription,
                    @UserID = :UserID,
                    @ClientId = :ClientId,
                    @JobSectionCode = :JobSectionCode,
                    @JobSubFamilyID = :JobSubFamilyID,
                    @LCID = :LCID
            `,
            {
                JobCategoryID: toNumber(jobSubCategoryDetail.jobCategoryID),
                JobSubCategoryName: toStringOr(jobSubCategoryDetail.jobSubCategoryName),
                JobSubCategoryDescription: toStringOr(jobSubCategoryDetail.jobSubCategoryDescription),
                UserID: toNumber(jobSubCategoryDetail.userID),
                ClientId: toNumber(jobSubCategoryDetail.clientId),
                JobSectionCode: toStringOr(jobSubCategoryDetail.jobSectionCode),
                JobSubFamilyID: toStringOr(jobSubCategoryDetail.jobSubFamilyID),
                LCID: toLocale(jobSubCategoryDetail.lcid),
            }
        );
    }

    @LogErrors()
    async addJobLevelDetail(jobLevelDetail: JobLevel): Promise<AddJobLevelDetailDBResponse[]> {
        try {
            return await this.sql.query(`
                    exec CMM.dbo.AddJobLevelDetail
                        @JobCategoryID = :JobCategoryID,
                        @JobLevelDetailOrder = :JobLevelDetailOrder,
                        @JobSubCategoryID = :JobSubCategoryID,
                        @JobLevelDetailDescription = :JobLevelDetailDescription,
                        @UserId = :UserID,
                        @LCID = :LCID
                `,
                {
                    JobCategoryID: toNumber(jobLevelDetail.jobCategoryID),
                    JobLevelDetailOrder: toNumber(jobLevelDetail.jobLevelDetailOrder),
                    JobSubCategoryID: toNumber(jobLevelDetail.jobSubCategoryID),
                    JobLevelDetailDescription: toStringOr(jobLevelDetail.jobLevelDetailDescription),
                    UserID: toNumber(jobLevelDetail.userId),
                    LCID: toLocale(jobLevelDetail.lcid),
                }
            );
        } catch (e) {
            return await this.sql.query(`
                exec CMM.dbo.AddJobLevelDetail
                    @JobCategoryID = :JobCategoryID,
                    @JobLevelDetailOrder = :JobLevelDetailOrder,
                    @JobSubCategoryID = :JobSubCategoryID,
                    @JobLevelDetailDescription = :JobLevelDetailDescription,
                    @LCID = :LCID
            `,
                {
                    JobCategoryID: toNumber(jobLevelDetail.jobCategoryID),
                    JobLevelDetailOrder: toNumber(jobLevelDetail.jobLevelDetailOrder),
                    JobSubCategoryID: toNumber(jobLevelDetail.jobSubCategoryID),
                    JobLevelDetailDescription: toStringOr(jobLevelDetail.jobLevelDetailDescription),
                    LCID: toLocale(jobLevelDetail.lcid),
                }
            );
        }
    }

    @LogErrors()
    async itemModificationSubCategoryDetails(values: string[], paramsObj: Object): Promise<void> {
        await this.sql.query(`
                Insert into
                    CMM.dbo.ItemModificationSubCategoryDetails (
                        ItemModificationID,
                        JobCategoryID,
                        JobSubCategoryID,
                        JobSubCategoryName,
                        JobLevelDetailDescription,
                        JobLevelDetailID,
                        JobLevelDetailOrder,
                        JobSubfamilyId,
                        JobSubCategoryDescription,
                        isCustomLevel,
                        LCID
                    )
                    VALUES ${values}
            `,
            paramsObj
        );
    }

    @LogErrors()
    async updateSubCategory(itemModificationId: string): Promise<void> {
        await this.sql.query(`
                exec CMM.dbo.update_SubCategory
                    @ItemModificationID = :itemModificationId
            `,
            {
                itemModificationId: toNumber(itemModificationId),
            }
        );
    }

    @LogErrors()
    async JobSubCategory(JobSubCategoryID: number): Promise<void> {
        await this.sql.query(`
                update
                    CMM.dbo.JobSubCategory
                set
                    IsCustom = :IsCustom
                where
                    JobSubCategoryID = :JobSubCategoryID
            `,
            {
                IsCustom: 0,
                JobSubCategoryID: toNumber(JobSubCategoryID),
            }
        );
    }

    @LogErrors()
    async getResponsibilityDescriptions(clientId: number, lcid: string, jobSectionName: string): Promise<DescriptionDBResponse[]> {
        return await this.sql.query(`
                Use successprofile
                DECLARE
                    @ModelID Int,
                    @CustModelID Int,
                    @ClientID Int,
                    @LCID NVARCHAR(20),
                    @JobSectionName NVARCHAR (40)

                SET @ClientID = :ClientId
                SET @LCID = :LCID
                SET @JobSectionName = :JobSectionName

                SELECT
                    @ModelID = JobdescriptionModelID
                FROM
                    Successprofile.dbo.ClientStandardModelMapping
                WHERE
                    ClientID = @ClientID
                        AND
                    IsActive = 1

                SELECT
                    TOP 1 @CustModelID = MAX(JobDescriptionModelID)
                FROM
                    CMM.dbo.JobDescriptionModel
                WHERE
                    ClientId = @ClientID
                        AND
                    isActive = 1

                SELECT
                    DJL.JobSubCategoryName,
                    DJL.JobLevel,
                    COALESCE(DJLT.JobLevelLabel,DJL.JobLevelLabel) AS JobLevelLabel,
                    COALESCE(DJLT.JobLevelDescription, DJL.JobLevelDescription) AS JobLevelDescription
                FROM
                    SuccessProfile.dbo.DefaultJobLevelDescriptions DJL
                LEFT JOIN
                    SuccessProfile.dbo.DefaultJobLevelDescriptionsTranslation DJLT
                        ON
                            (
                                DJL.JobSectionName = DJLT.JobSectionName
                                    AND
                                DJL.JobLevel = DJLT.JobLevel
                                    AND
                                DJLT.JobDescriptionModelID = @CustModelID
                                    AND
                                LCID = @LCID
                            )
                WHERE
                    DJL.JobSectionName = @JobSectionName
                        AND
                    DJL.JobdescriptionModelID = @ModelID
                ORDER BY
                    DJL.JobLevel
            `,
            {
                ClientId: toNumber(clientId),
                LCID: toLocale(lcid),
                JobSectionName: toStringOr(jobSectionName),
            }
        );
    }

    @LogErrors()
    async getUserCountryCode(query: ResponsibilityDescriptionQuery): Promise<GetUserLocaleDBResponse[]> {
        return await this.sql.query(`
                SELECT
                    CountryCode
                FROM
                    SuccessProfile.dbo.Country
                WHERE
                    CountryID IN (
                        SELECT
                            CountryID
                        FROM
                            Activate.dbo.Locations
                        WHERE
                            LocationID IN (
                                SELECT
                                    LocationID
                                FROM
                                    SuccessProfile.dbo.Person
                                WHERE
                                    PersonID = :PersonID
                            )
                        )
            `,
            {
                PersonID: toNumber(query.userId),
            }
        );
    }

    @LogErrors()
    async getSuccessProfileSubCategoryDependentDescriptions(query: ResponsibilityDescriptionQuery): Promise<GetDependentSubCategoryDBResponse[]> {
        return  await this.sql.query(`
                exec SuccessProfile.dbo.GetComponentsForSkills
                    @ClientID = :clientId,
                    @LCID = :locale,
                    @JobSubCategoryList = :jobSubCategoryList
            `,
            {
                locale: toLocale(query.locale),
                clientId: toNumber(query.loggedInUserClientId),
                jobSubCategoryList: query.subCategoryIds.split(',').map(i => toNumber(i)).join(',')
            }
        )
    }

    @LogErrors()
    async getSuccessProfileSubCategoryDescriptions(query: ResponsibilityDescriptionQuery): Promise<GetSuccessProfileDescriptionsDBResponse[]> {
        return await this.sql.query(`
                Declare
                    @ClientID BigInt,
                    @ClientJobID BigInt,
                    @LCID nvarchar(20)

                Set @ClientID = :ClientID
                Set @LCID = :LCID;

                SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED
                SELECT
                    CAST (TRIM(Value) AS INT) AS JobSubCategoryId
                INTO
                    #SubCat
                FROM
                    STRING_SPLIT (:SubCategoryIds, ',')
                WHERE
                    TRIM(Value) <> '';

                SELECT
                    JSC.JobSubCategoryID,
                    COALESCE (
                        JSCT.JobSubCategoryName,
                        JSC.JobSubCategoryName
                    ) AS JobSubCategoryName,
                    JLD.JobLevelDetailOrder AS JobLevelOrder,
                    COALESCE (
                        JSD.DefaultText,
                        JSDDefault.DefaultText,
                        custJLDT.JobLevelDetailDescription,
                        JLDT.JobLevelDetailDescription,
                        JLD.JobLevelDetailDescription
                    ) AS JobSubCategoryDescription,
                    JLD.UseDefaultDescription AS [default],
                    COALESCE (
                        JLT.JobLevelLabel,
                        JL.JobLevelLabel
                    ) AS JobLevelLabel,
                    JSCC.GlobalSubCategoryCode,
                    COALESCE (
                        JSCT.JobSubCategoryDescription,
                        JSC.JobSubCategoryDescription
                    ) AS JobSubCategoryDefinition
                FROM
                    #SubCat stg
                INNER JOIN
                    SuccessProfile.dbo.JobSubCategory JSC
                        ON
                            STG.JobSuBCategoryID = JSC.JobSubCategoryID
                INNER JOIN
                    SuccessProfile.dbo.JobLevelDetail JLD
                        ON
                            JSC.JobSubCategoryID = JLD.JobSubCategoryID
                INNER JOIN
                    SuccessProfile.dbo.JobLevel AS JL
                        ON
                            JLD.JobLevelID = JL.JobLevelID
                LEFT JOIN
                    SuccessProfile.dbo.JobSubCategoryCodes JSCC
                        ON
                            JSC.JobSubCategoryCde = JSCC.JobSubCategoryCde
                LEFT JOIN
                    SuccessProfile.dbo.JobLevelTranslation AS JLT
                        ON
                            JL.JobLevelID = JLT.JobLevelID
                                AND
                            JLT.LCID = @LCID
                LEFT JOIN
                    SuccessProfile.dbo.JobSectionDefault JSD
                        ON
                            JL.JobSectionID = JSD.JobSectionID
                                AND
                            JLD.useDefaultDescription = 1
                                AND
                            JSD.LCID =  @LCID
                LEFT JOIN
                    (
                        SELECT
                            *
                        FROM
                            SuccessProfile.dbo.JobSectionDefault
                        WHERE
                            LCID = 'en'
                    ) JSDDefault
                        ON
                            JL.JobSectionID = JSDDefault.JobSectionID
                                AND
                            JLD.useDefaultDescription = 1
                LEFT JOIN
                    SuccessProfile.dbo.JobSubCategoryTranslation JSCT
                        ON
                            JSCT.JobSubCategoryID = JSC.JobSubCategoryID
                                AND
                            JSCT.LCID = @LCID
                LEFT JOIN
                    SuccessProfile.dbo.JobLevelDetailTranslation custJLDT
                        ON
                            custJLDT.JobLevelDetailId = JLD.JobLevelDetailId
                                AND
                            custJLDT.LCID = @LCID
                LEFT JOIN
                    SuccessProfile.dbo.JobLevelDetailTranslation AS JLDT
                        ON
                            JLD.JobLevelDetailCode = JLDT.JobLevelDetailCode
                                AND
                            JLDT.LCID = @LCID
                ORDER BY
                    JSC.JobSubCategoryID,
                    JL.JobLevelOrder
            `,
            {
                ClientID: toNumber(query.loggedInUserClientId),
                LCID: toLocale(query.locale),
                SubCategoryIds: toStringOr(query.subCategoryIds),
            }
        );
    }

    @LogErrors()
    async selectUser(personId: number, locale: string): Promise<UserSelectedRawDBResponse[]> {
        return await this.sql.query(`
                use SuccessProfile;
                declare
                    @personId Bigint,
                    @locale nvarchar(10)
                ;

                set @personId = :PersonID;
                set @locale = :Locale;

                SELECT
                    P.PersonID,
                    P.ClientID,
                    P.FirstName,
                    P.LastName,
                    P.JobTitle,
                    SuccessProfile.dbo.fn_GetUnixTimeStamp(P.CreatedOn) AS CreatedOn,
                    SuccessProfile.dbo.fn_GetUnixTimeStamp(P.ModifiedOn) AS ModifiedOn,
                    P.EMail,
                    P.PhoneNumber,
                    P.JobRoleTypeID,
                    P.GradeID,
                    GT.Name JobGrade,
                    WU.UserName,
                    C.ClientName companyName,
                    CJT.ClientJobTitleID JobId,
                    JFT.JobFamilyID,
                    JFT.Name JobFamilyName,
                    JSF.JobSubFamilyID,
                    JSFT.Name JobSubFamilyName,
                    JRTT.Name JobRoleTypeName,
                    JRT.GradeScale,
                    PD.DocumentID AS SuccessProfileId,
                    P.LoginAs as LoginAs,
                    P.ExternalUUID,
                    C.ExternalUUID
                FROM
                    SuccessProfile.dbo.Person AS P
                INNER JOIN
                    Activate.dbo.WebUser AS WU
                        ON
                            P.PersonID = WU.UserId
                INNER JOIN
                    SuccessProfile.dbo.Client AS C
                        ON
                            P.ClientId = C.ClientID
                LEFT OUTER JOIN
                    SuccessProfile.dbo.ClientJobTitles AS CJT
                        ON P.JobRoleTypeID = CJT.JobRoleTypeID
                LEFT OUTER JOIN
                    Activate.dbo.PersonDocument AS PD
                        ON PD.PersonID = P.PersonID
                LEFT OUTER JOIN
                    SuccessProfile.dbo.GradeTranslations AS GT
                        ON
                            P.GradeID = GT.GradeID
                                AND
                            GT.LCID = @locale
                LEFT OUTER JOIN
                    SuccessProfile.dbo.JobRoleTypeTranslations AS JRTT
                        ON
                            P.JobRoleTypeID = JRTT.JobRoleTypeID
                                AND
                            JRTT.LCID = @locale
                LEFT OUTER JOIN
                    SuccessProfile.dbo.JobRoleType AS JRT
                        ON
                            JRTT.JobRoleTypeID = JRT.JobRoleTypeID
                LEFT OUTER JOIN
                    SuccessProfile.dbo.JobSubFamilyTranslations AS JSFT
                        ON
                            JRT.JobSubFamilyID = JSFT.JobSubFamilyID
                                AND
                            JSFT.LCID = @locale
                LEFT OUTER JOIN
                    SuccessProfile.dbo.JobSubFamily AS JSF
                        ON
                            JSFT.JobSubFamilyID = JSF.JobSubFamilyID
                LEFT OUTER JOIN
                    SuccessProfile.dbo.JobFamilyTranslations AS JFT
                        ON
                            JSF.JobFamilyID=JFT.JobFamilyID
                                AND
                            JFT.LCID = @locale
                WHERE
                    P.PersonID = @personId
            `,
            {
                PersonID: toNumber(personId),
                Locale: toLocale(locale),
            }
        );
    }

    @LogErrors()
    async getClientSettings(clientId: number): Promise<ClientSettingsRawDBResponse[]> {
        return await this.sql.query(`
                SELECT
                    TOP(1) *
                from
                    SuccessProfile.dbo.JobSectionClientSettings
                where
                    clientID = :clientId
            `,
            {
                clientId: toNumber(clientId)
            }
        );
    }

    @LogErrors()
    async searchSubCategory(jobModelID: number, sectionName: string, lcid: string): Promise<SearchCategoriesRawDBResponse[]> {
        return await this.sql.query(`
                use SuccessProfile;

                Declare
                    @JobModelID BigInt,
                    @SectionName nvarchar(20),
                    @LCID nvarchar(20)

                Set @JobModelID = :JobModelID;
                set @SectionName = :SectionName;
                Set @LCID = :LCID;

                SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED
                SELECT
                    JS.JobSectionID,
                    COALESCE(
                        JST.JobSectionName,
                        JS.JobSectionName
                    ) AS JobSectionName,
                    COALESCE(
                        JST.JobSectionDescription,
                        JS.JobSectionDescription
                    ) AS JobSectionDescription,
                    JC.JobCategoryID,
                    COALESCE(
                        JCT.JobCategoryName,
                        JC.JobCategoryName
                    ) AS JobCategoryName,
                    COALESCE(
                        JCT.JobCategoryDescription,
                        JC.JobCategoryDescription
                    ) AS JobCategoryDescription,
                    JSC.JobSubCategoryID,
                    COALESCE(
                        JSCT.JobSubCategoryName,
                        JSC.JobSubCategoryName
                    ) AS JobSubCategoryName,
                    COALESCE(
                        JSCT.JobSubCategoryDescription,
                        JSC.JobSubCategoryDescription
                    ) AS JobSubCategoryDefinition,
                    COALESCE(
                        JLDT.JobLevelDetailDescription,
                        JLD.JobLevelDetailDescription
                    ) AS JobSubCategoryDescription,
                    JL.JobLevelOrder AS JobLevelOrder,
                    JSC.ShortProfile AS ShortProfile,
                    COALESCE (
                        JLT.JobLevelLabel,
                        JL.JobLevelLabel
                    ) AS JobLevelLabel ,
                    JSCC.GlobalSubCategoryCode
                FROM (
                    Select
                        JobSectionID
                    from
                        SuccessProfile.dbo.JobDescriptionModelItems
                    where
                        JobDescriptionModelID = @JobModelID
                            and
                        SectionProductID = 1
                ) JDMI
                INNER JOIN (
                    SELECT
                        *
                    FROM
                        SuccessProfile.dbo.JobSection
                    where
                        JobSectionCode = @SectionName
                ) JS
                    on
                        JS.JobSectionID = JDMI.JobSectionID
                LEFT OUTER JOIN (
                    SELECT
                        *
                    FROM
                        SuccessProfile.dbo.JobSectionTranslation
                    WHERE
                        LCID = @LCID
                ) JST
                    ON
                        JST.JobSectionID = JS.JobSectionID
                INNER JOIN
                    SuccessProfile.dbo.JobCategory JC
                        ON
                            JS.JobSectionID = JC.JobSectionID
                LEFT OUTER JOIN
                    (
                        SELECT
                            *
                        FROM
                            SuccessProfile.dbo.JobCategoryTranslation
                        WHERE
                            LCID = @LCID
                    ) JCT
                        ON
                            JCT.JobCategoryID = JC.JobCategoryID
                INNER JOIN
                    (
                        SELECT
                            *
                        FROM
                            SuccessProfile.dbo.JobSubCategory jsc
                        WHERE
                            JobSourceID = 0
                                AND
                            DisplayJobSubCategory = 1
                                AND
                            (
                                (
                                    (
                                        JobSubCategoryCde <> ''
                                            AND
                                        JobSubCategoryCde IS NOT NULL
                                    )
                                        OR
                                    ISNULL(LCID, @LCID) = @LCID
                                )
                                    OR
                                EXISTS (
                                    SELECT
                                        1
                                    FROM
                                        SuccessProfile.dbo.JobSubCategoryTranslation jsct
                                    WHERE
                                        jsct.JobSubCategoryID = jsc.JobSubCategoryID
                                            and
                                        jsct.lcid = @lcid
                                )
                            )
                    ) JSC
                        ON
                            JC.JobCategoryID = JSC.JobCategoryID
                LEFT OUTER JOIN
                    (
                        SELECT
                            *
                        FROM
                            SuccessProfile.dbo.JobSubCategoryTranslation
                        WHERE
                            LCID = @LCID
                    ) JSCT
                        ON
                           JSCT.JobSubCategoryID = JSC.JobSubCategoryID
                Inner Join
                    SuccessProfile.dbo.JobLevelDetail JLD
                        ON
                            JLD.JobSubCategoryID = JSC.JobSubCategoryID
                                AND
                            JLD.UseDefaultDescription = 0
                LEFT OUTER JOIN
                    (
                        SELECT
                            *
                        FROM
                            SuccessProfile.dbo.JobLevelDetailTranslation
                        WHERE
                            LCID = @LCID
                    ) JLDT
                        ON
                            JLDT.JobLevelDetailCode = JLD.JobLevelDetailCode
                                and
                            JLD.ISClientCustomized = 0
                Inner Join
                    SuccessProfile.dbo.JobLevel JL
                        ON
                            JLD.JobLevelID = JL.JobLevelID
                LEFT OUTER JOIN
                    (
                        SELECT
                            *
                        FROM
                            SuccessProfile.dbo.JobLevelTranslation
                        WHERE
                            LCID = @LCID
                    ) JLT
                        ON
                            JL.JobLevelID = JLT.JobLevelID
                LEFT OUTER JOIN
                    SuccessProfile.dbo.JobSubCategoryCodes JSCC
                        ON
                            JSC.JobSubCategoryCde = JSCC.JobSubCategoryCde
                ORDER BY
                    COALESCE(
                        JSCT.JobSubCategoryName,
                        JSC.JobSubCategoryName
                    )
                    COLLATE
                        SQL_Latin1_General_CP850_CI_AS
                    ASC
            `,
            {
                JobModelID: toNumber(jobModelID),
                SectionName: toStringOr(sectionName),
                LCID: toLocale(lcid),
            }
        );
    }

    @LogErrors()
    async updateJobSubCategory(jobCategoryID: number, jobSubCategoryID: number, isActive: number): Promise<Object> {
            return await this.sql.dataSource.manager.update(
                'CMM.dbo.JobSubCategory',
                {
                    JobSubCategoryID: toNumber(jobSubCategoryID),
                    JobCategoryID: toNumber(jobCategoryID)
                },
                {
                    DisplayJobSubCategory: toNumber(isActive)
                },
            );
    }

    @LogErrors()
    async getModelsBySubCategoryType(
        query: ModelQuery,
        subCategoryType: SubcategoryType
    ): Promise<ModelDBResponse[]> {
        return await this.sql.query(`
            exec CMM.dbo.GetModelsBySubCategoryType
                @In_ClientID = :clientId,
                @In_LCID = :locale,
                @In_SubCategoryType = :subCategoryType
        `,
            {
                clientId: toNumber(query.preferredClientId),
                locale: toLocale(query.preferredLocale),
                subCategoryType
            }
        );
    }
}
