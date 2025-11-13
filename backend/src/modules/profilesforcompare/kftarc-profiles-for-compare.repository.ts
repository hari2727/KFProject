import {
    ProfileCollectionIdDBResponse,
    ProfileCompareQuery,
    ProfileMatchAndCompareDBResponse,
    SEARCH_JOBS_MY_DESCRIPTIONS
} from './kftarc-profiles-for-compare.interface';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { Injectable } from '@nestjs/common';
import { toLocale, toNumber, toStringOr } from '../../_shared/convert';
import { TypeOrmHelper } from '../../_shared/db/typeorm.helper';

@Injectable()
export class KfTarcProfilesForCompareRepository {

    constructor(protected sql: TypeOrmHelper) {
    }

    @LogErrors()
    async getProfileCollectionIds(userId: number): Promise<ProfileCollectionIdDBResponse[]> {
        return await this.sql.query(`
                SELECT
                    ProfileCollectionID
                FROM
                    ProductAdmin.dbo.view_ProfileCollectionUserPrimaryAndSecondaryGroupsDetails
                WHERE
                    PersonID = :UserId
    `,
            {
                UserId: toNumber(userId),
            }
        );
    }

    @LogErrors()
    async getJobRoleByTypeId(query: ProfileCompareQuery): Promise<ProfileMatchAndCompareDBResponse[]> {
        const profileCollectionIds =
            (await this.getProfileCollectionIds(query.userId)).map(item => item.ProfileCollectionID);

        let joinQuery = '';

        if (query?.inputType === SEARCH_JOBS_MY_DESCRIPTIONS) {
            if (profileCollectionIds?.length) {
                joinQuery = `
                    INNER JOIN
                        (
                            SELECT
                                profileid
                            FROM
                                SuccessProfile.dbo.view_profilecollectionprofilesdetails
                            WHERE
                                profilecollectionid IN (${ profileCollectionIds.join(',') })
                            UNION SELECT
                                clientjobid
                            FROM
                                SuccessProfile.dbo.clientjob
                            WHERE
                                jobsourceid = :UserId
                        ) AS vpcpd
                            ON
                                cj.parentclientjobid = vpcpd.profileid
                `
            } else {
                joinQuery = `
                    LEFT OUTER JOIN
                        (
                            SELECT
                                pcpd.profileid
                            FROM
                                SuccessProfile.dbo.view_profilecollectionusergroupdetails AS pcugd
                            INNER JOIN
                                SuccessProfile.dbo.view_profilecollectionprofilesdetails AS pcpd
                                    ON
                                        pcugd.profilecollectionid = pcpd.profilecollectionid
                            WHERE
                                pcugd.personid = :UserId
                        ) AS vpcpd
                            ON
                                cj.parentclientjobid = vpcpd.profileid
                `
            }
        } else {
            if (profileCollectionIds?.length) {
                joinQuery = `
                    INNER JOIN
                        (
                            SELECT
                                profileid
                            FROM
                                SuccessProfile.dbo.view_profilecollectionprofilesdetails
                            WHERE
                                profilecollectionid IN (${ profileCollectionIds.join(',') })
                            UNION SELECT
                                clientjobid
                            FROM
                                SuccessProfile.dbo.clientjob
                            WHERE
                                jobsourceid = :UserId
                        ) AS vpcpd
                            ON
                                cj.clientjobid=vpcpd.profileid
                `
            } else {
                joinQuery = `
                    LEFT OUTER JOIN
	                    (
                            SELECT
                                pcpd.profileid
                            FROM
                                SuccessProfile.dbo.view_profilecollectionusergroupdetails AS pcugd
                            INNER JOIN
                                SuccessProfile.dbo.view_profilecollectionprofilesdetails AS pcpd
                                    ON
                                        pcugd.profilecollectionid = pcpd.profilecollectionid
                            WHERE
                                pcugd.personid = :UserId
                        ) AS vpcpd
                            ON
                                cj.clientjobid = vpcpd.profileid
                `
            }
        }
        return await this.sql.query(`
                use SuccessProfile;

                SELECT
                    CJ.ClientJobID,
                    COALESCE(
                        CJT.JobName,
                        CJ.JobName
                    ) AS JobName,
                    CJ.HayReferenceLevel,
                    CJE.ShortProfile,
                    COALESCE(
                        KFLT.KFManagementName,
                        KFL.KFManagementName
                    ) AS KFManagementName,
                    CASE
                        WHEN cj.JobSourceID = 0 AND CJ.JRTDetailID LIKE 'GN%' THEN 'LEVELS'
                        WHEN CJ.JobSourceID = 0 AND COALESCE(CJ.IsProfileType, 0) = 1 THEN 'AI_PROFILE'
                        WHEN CJ.JobSourceID = 0 THEN 'BEST_IN_CLASS'
                        WHEN CJ.JobSourceID = 1 THEN 'O_NET'
                        ELSE 'CUSTOM_PROFILE'
                    END AS LevelType
                FROM
                    SuccessProfile.dbo.Clientjob AS CJ
                LEFT JOIN
                    (
                        SELECT
                            *
                        FROM
                            SuccessProfile.dbo.ClientJobTranslation
                        WHERE
                            LCID = :LCID
                    ) CJT
                        ON
                            CJ.ClientJobID = CJT.ClientJobID
                INNER JOIN
                    SuccessProfile.dbo.ClientjobExtension AS CJE
                        ON
                            CJ.ClientJobID = CJE.ClientJobID
                INNER JOIN
                    SuccessProfile.dbo.view_KFLevels AS kfl
                        ON
                            CJ.KFLevelID = kfl.KFLevelID
                LEFT OUTER JOIN
                    (
                        SELECT
                            *
                        FROM
                            SuccessProfile.dbo.KFManagementTranslation
                        WHERE
                            LCID = :LCID
                    ) AS KFLT
                        ON
                            KFLT.KFManagementID = KFL.KFManagementID
                INNER JOIN
                    SuccessProfile.dbo.Person PP
                        ON
                            CJ.JobSourceID = PP.PersonID
                LEFT OUTER JOIN
                    SuccessProfile.dbo.JobRoleType AS JRT
                        ON
                            JRT.JobRoleTypeID = SUBSTRING(CJ.JRTDetailID, 1, 5)
                LEFT JOIN
                    (
                        SELECT
                            JobRoleTypeID,
                            Name AS JobRoleName
                        FROM
                            SuccessProfile.dbo.JobroleTypeTranslations
                        WHERE
                            LCID = 'en'
                    ) AS JRTDT
                        ON
                            JRTDT.JobRoleTypeID = JRT.JobRoleTypeID
                LEFT JOIN
                    (
                        SELECT
                            JobRoleTypeID,
                            Name AS JobRoleName
                        FROM
                            SuccessProfile.dbo.JobroleTypeTranslations
                        WHERE
                            LCID = :LCID
                    ) AS JRTDTT
                        ON
                            JRTDTT.JobRoleTypeID = JRT.JobRoleTypeID
                LEFT JOIN
                    SuccessProfile.dbo.ClientJobONET CJO
                        ON
                            CJO.ClientJobID = CJ.ClientJobID
                LEFT JOIN
                    SuccessProfile.dbo.ClientJobONETTranslation CJOT
                        ON
                            CJO.ClientJobID = CJOT.ClientJobID
                                AND
                            CJOT.LCID = :LCID
                ${joinQuery}
                WHERE
                    CJ.JobSourceID IN (0, 1)
                        AND
                    CJ.ClientJobStatusID NOT IN (4, 8)
                        AND
                    PP.clientid = 0
                        AND
                    CJ.BoxProfileFlag = 0
                        AND
                    CJ.ClientJobStatusID IN (1, 2, 3)
                        AND
                    JRT.JobRoleTypeID = :JobRoleTypeId
                        AND
                    (
                        CJ.JobSourceID = 0
                            AND
                        COALESCE(JRTDTT.JobRoleName, JRTDT.JobRoleName) = :JobRoleName
                            OR
                        CJ.JobSourceID = 1
                            AND
                        COALESCE(CJOT.OnetTitle, CJO.OnetTitle) = :OnetTitle
                    )
                        AND
                    ISNULL(CJ.HideJobInPM, 0) = 0
                        AND
                    CJ.JobDescriptionModelID = (
                        SELECT
                            JobDescriptionModelID
                        FROM
                            SuccessProfile.dbo.ClientStandardModelMapping
                        WHERE
                            ClientID = :ClientId
                                AND
                            IsActive = 1
                    )
            `,
            {
                LCID: toLocale(query.locale),
                JobRoleTypeId: toStringOr(query.jobRoleTypeId),
                JobRoleName: toStringOr(query.jobRoleName),
                OnetTitle: toStringOr(query.jobRoleName),
                ClientId: toNumber(query.loggedInUserClientId),
                UserId: toNumber(query.userId),
                // profileCollectionIds
            }
        );
    }
}
