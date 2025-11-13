import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger';
import {
    JobPropertiesStatusEnum,
    JobProperty,
    JobPropertyKeys,
    JobPropertyQueryResponse,
    QueryParams,
    SubProperty,
} from './job-properties.interface';
import { Loggers } from '../../_shared/log/loggers';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { toBit, toLocale, toNumber, toStringOr } from '../../_shared/convert';
import { TypeOrmHelper } from '../../_shared/db/typeorm.helper';

@Injectable()
export class JobPropertyRepository {
    protected logger: LoggerService;

    constructor(
        protected sql: TypeOrmHelper,
        protected loggers: Loggers,
    ) {
        this.logger = loggers.getLogger(JobPropertyRepository.name);
    }

    @LogErrors()
    async getAllJobPropertiesByClientId(clientId: number): Promise<JobPropertyQueryResponse[]> {
        return await this.sql.query(`
                exec CMM.dbo.GETJobPropertiesByClientID
                    @In_ClientID = :clientId
            `,
            {
                clientId: toNumber(clientId)
            }
        );
    }

    @LogErrors()
    async getCurrentStatusOfJobProperties(clientId: number): Promise<JobPropertiesStatusEnum> {
        return (await this.sql.query(`
                SELECT
                    CASE
                        WHEN cnt > 0
                        THEN 'MODIFIED'
                        ELSE 'PUBLISHED'
                    END AS Modification
                FROM (
                    SELECT
                        COUNT(1) AS cnt
                    FROM
                        CMM.dbo.ItemModificationSubCategory
                    WHERE
                        ClientID = :clientId
                            AND
                        ItemType = :itemType
                            AND
                        ModificationComplete = 0
                    ) A
            `,
            {
                clientId: toNumber(clientId),
                itemType: JobPropertyKeys.JOB_PROPERTIES_TYPE
            }
        ))[0].Modification;
    }

    @LogErrors()
    async getJobPropertiesByJobPropertyId(clientId: number, jobPropertyId: string): Promise<JobPropertyQueryResponse[]> {
        return await this.sql.query(`
                exec CMM.dbo.GETJobPropertiesByClientIDANDJobPropertyID
                    @In_ClientID = :clientId,
                    @In_JobPropertyID = :jobPropertyId
            `,
            {
                clientId: toNumber(clientId),
                jobPropertyId: toNumber(jobPropertyId)
            }
        );
    }

    @LogErrors()
    async publishJobProperties(clientId: number, locale: string, userId: number): Promise<void> {
        await this.sql.query(`
                exec Architect.dbo.Publishing_CMM_JobProp_To_Architect
                    @ClientID = :clientId,
                    @LCID = :locale,
                    @PersonID = :userId
            `,
            {
                clientId: toNumber(clientId),
                userId: toNumber(userId),
                locale: toLocale(locale)
            }
        );
    }

    async insertJobProperties(query: QueryParams, jobProperty: JobProperty): Promise<void> {
        await this.sql.query(`
                Insert into
                    CMM.dbo.JobProperty
                Select
                    :ClientID,
                    :LCID,
                    :JobPropertyName,
                    :JobPropertyName + ' Desc' JobPropertyDesc,
                    'CJP' + Convert(nvarchar, ISNULL(maxID, 0) + 1) JobPropertyCode,
                    :DisplayJobProperty,
                    :IsRequired,
                    :CreatedBy,
                    GETDATE() CreatedOn,
                    :ModifiedBy,
                    GETDATE() ModifiedOn,
                    :IsDeleted,
                    0,
                    :DisplayOrder
                from (
                    Select
                        MAX(Convert(int, SUBSTRING(JobPropertyCode, 4, 10))) maxID
                    from
                        CMM.dbo.JobProperty
                    where
                        Clientid = :ClientID
                            and
                        JobPropertyCode like 'CJP%'
                ) a
            `,
            {
                ClientID: toNumber(query.loggedInUserClientId),
                LCID: toLocale(query.locale),
                JobPropertyName: toStringOr(jobProperty.name),
                DisplayJobProperty: toBit(jobProperty.isActive === true),
                DisplayOrder: toNumber(jobProperty.displayOrder),
                IsRequired: toBit(jobProperty?.isRequired),
                CreatedBy: toNumber(query.userId),
                ModifiedBy: toNumber(query.userId),
                IsDeleted: toBit(jobProperty.isDeleted),
            }
        );
    }

    async updateJobProperties(query: QueryParams, jobProperty: JobProperty): Promise<void> {
        await this.sql.query(`
                Update
                    CMM.dbo.JobProperty
                Set
                    JobPropertyName = :JobPropertyName,
                    DisplayJobProperty = :DisplayJobProperty,
                    DisplayOrder = :DisplayOrder,
                    IsRequired = :IsRequired,
                    IsDeleted = :IsDeleted,
                    IsMultiSelected = :IsMultiSelected
                Where
                    JobPropertyID = :JobPropertyID
            `,
            {
                JobPropertyName: toStringOr(jobProperty.name),
                DisplayOrder: toNumber(jobProperty.displayOrder),
                IsRequired: toBit(jobProperty?.isRequired),
                IsDeleted: toBit(jobProperty.isDeleted),
                JobPropertyID: toNumber(jobProperty.id),
                DisplayJobProperty: toBit(jobProperty.isActive),
                IsMultiSelected: toBit(jobProperty.isMultiSelected),
            }
        );
    }

    async insertSubProperties(query: QueryParams, insertSubProperties: SubProperty[]): Promise<void> {
        const modifiedOn = new Date().toISOString();
        const userId = toNumber(query.userId);
        const locale = toLocale(query.locale);

        const DTOs = insertSubProperties.filter(Boolean);

        await this.sql.insert(
            DTOs,
            'CMM.dbo.JobPropertyValues',
            [
                'JobPropertyID',
                'JobPropertyValueName',
                'IsActive',
                'DisplayOrder',
                'LCID',
                'CreatedBy',
                'CreatedOn',
                'ModifiedBy',
                'ModifiedOn'
            ],
            dto => [
                toNumber(dto.jobPropertyId),
                toStringOr(dto.name),
                toBit(dto.isActive),
                toNumber(dto.displayOrder),
                locale,
                userId,
                modifiedOn,
                userId,
                modifiedOn
            ]
        );
    }

    async updateSubProperties(query: QueryParams, subProperty: SubProperty): Promise<void> {
        await this.sql.query(`
                Update
                    CMM.dbo.JobPropertyValues
                Set
                    JobPropertyValueName = :JobPropertyValueName,
                    ModifiedBy = :ModifiedBy,
                    ModifiedOn = GETDATE(),
                    DisplayOrder = :DisplayOrder
                where
                    JobPropertyValueID = :JobPropertyValueID
            `,
            {
                JobPropertyValueName: toStringOr(subProperty.name),
                DisplayOrder: toNumber(subProperty.displayOrder),
                ModifiedBy: toNumber(query.userId),
                JobPropertyValueID: toNumber(subProperty.id),
            }
        );
    }

    async updateJobPropertiesDeleted(jobProperties: JobProperty[], subProperties: SubProperty[]): Promise<void> {
        const allPropertyIds = jobProperties?.map(jp => toNumber(jp.id));
        const allSubPropertyIds = subProperties?.map(sp => toNumber(sp.id));

        await this.sql.query(`
                UPDATE
                    CMM.dbo.JobPropertyValues
                SET
                    IsActive = 0
                WHERE
                    JobPropertyValueID IN (
                        SELECT
                            JPV.JobPropertyValueID
                        FROM
                            CMM.dbo.JobProperty AS jp
                        INNER JOIN
                            CMM.dbo.JobPropertyValues AS JPV
                                ON
                                    jp.JobPropertyID = JPV.JobPropertyID
                        WHERE
                            JP.JobPropertyID IN (${ allPropertyIds.join(',') })
                            ${
                                allSubPropertyIds?.length ? `
                                    AND
                                JPV.JobPropertyValueID NOT IN (${ allSubPropertyIds.join(',') })
                            ` : ''}
                    )
            `,
            {
                // allPropertyIds,
                // allSubPropertyIds
            }
        );
    }

    async insertItemModification(query: QueryParams) {
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
                        :ItemType,
                        :CompetencyModelGUID,
                        :CompetencyModelVersion,
                        :LCID,
                        :ClientID,
                        :ModifiedBy,
                        GETUTCDATE(),
                        0
                    )
                    SELECT ItemModificationID AS ItemID FROM @tablevar
            `,
            {
                ItemType: JobPropertyKeys.JOB_PROPERTIES_TYPE,
                CompetencyModelGUID: null,
                CompetencyModelVersion: '1.0',
                LCID: toLocale(query.locale),
                ClientID: toNumber(query.loggedInUserClientId),
                ModifiedBy: toNumber(query.userId),
            }
        );
    }
}
