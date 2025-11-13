import { Injectable } from '@nestjs/common';
import { AppCode as ec } from '../../app.const';
import {
    BulkPublishStatusDBResponse,
    CompetencyLevelRaw,
    CompetencyModelRaw,
    CompetencyRaw,
    selectBulkMapItemId,
    SpsDataRaw,
    SpsDataStream,
    SpsIdsRaw,
    SpsMetaDataRaw,
} from './bm-mssql.i';
import { MssqlDataSets } from './bm.enum';
import { BulkPublishStatusQueryParams, SkillsQueryProps, SkillsResponseFromDB } from './bm.service.i';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { MapErrors } from '../../_shared/error/map-errors.decorator';
import { Nullable } from '../../_shared/types';
import { toLocale, toNumber, toStringOr } from '../../_shared/convert';
import { KfTarcRolesInterface as Kf } from '../roles/kftarc-roles.interface';
import { TypeOrmHelper } from '../../_shared/db/typeorm.helper';

@Injectable()
export class BmMssqlService {

    constructor(protected sql: TypeOrmHelper) {
    }

    @MapErrors({ errorCode: ec.EXTERNAL_CALL_ERR })
    @LogErrors()
    async getClientProfilesAndIdsForBulkBC(
        clientId: number,
        userId: number,
        locale: string,
        custGrade: string,
        grade: string,
        level: string,
        pageIndex: number,
        pageSize: number,
        searchString: string,
        sortBy: string,
        sortColumn: string,
        subFunction: string,
    ): Promise<[SpsDataRaw[], SpsIdsRaw[]]> {
        const dataSetsResult = await this.sql.queryDataSets<SpsDataStream>(`
                exec SuccessProfile.dbo.GetClientProfilesForBulkBC
                    @In_ClientID = :ClientID,
                    @In_UserID = :UserID,
                    @In_Locale = :Locale,
                    @In_CustGrade = :CustGrade,
                    @In_Grade = :Grade,
                    @In_Level = :Level,
                    @In_pageIndex = :pageIndex,
                    @In_pageSize = :pageSize,
                    @In_searchString = :searchString,
                    @In_sortBy = :sortBy,
                    @In_sortColumn = :sortColumn,
                    @In_SubFunction = :subFunction
            `,
            {
                ClientID: toNumber(clientId),
                UserID: toNumber(userId),
                Locale: toLocale(locale),
                CustGrade: custGrade,
                Grade: grade,
                Level: level,
                pageIndex: toNumber(pageIndex, 0) || Kf.Defaults.pageIndex,
                pageSize: toNumber(pageSize, 0) || Kf.Defaults.pageSize,
                sortBy,
                sortColumn,
                subFunction,
                searchString
            }
        );
        return [
            dataSetsResult[MssqlDataSets.SPS_DATA_RAW] || [],
            dataSetsResult[MssqlDataSets.SPS_IDS_RAW] || []
        ];
    }

    @MapErrors({ errorCode: ec.EXTERNAL_IO_CALL_ERR })
    @LogErrors()
    async getClientProfilesIdsForBulkBC(clientId: number, userId: number, locale: string): Promise<Nullable<SpsIdsRaw[]>> {
        return await this.sql.query(`
                exec SuccessProfile.dbo.GetClientProfilesIdsForBulkBC
                    @ClientID = :clientId,
                    @LCID = :locale,
                    @UserID = :userId
            `,
            {
                clientId: toNumber(clientId),
                userId: toNumber(userId),
                locale: toLocale(locale),
            }
        );
    }

    @MapErrors({ errorCode: ec.EXTERNAL_IO_CALL_ERR })
    @LogErrors()
    async getBulkBCProfileMetadata(clientId: number, userId: number, locale: string): Promise<Nullable<SpsMetaDataRaw[]>> {
        return await this.sql.query(`
                exec SuccessProfile.dbo.GetBulkBCProfileMetadata
                    @ClientID = :clientId,
                    @LCID = :locale,
                    @UserID = :userId
            `,
            {
                clientId: toNumber(clientId),
                userId: toNumber(userId),
                locale: toLocale(locale),
            }
        );
    }

    @MapErrors({ errorCode: ec.EXTERNAL_IO_CALL_ERR })
    @LogErrors()
    async getClientsPublishedCompetencyModel(clientId: number): Promise<Nullable<CompetencyModelRaw[]>> {
        return await this.sql.query(`
                exec CMM.dbo.GetClientsPublishedCompetencyModel
                    @In_ClientID = :clientId
            `,
            {
                clientId: toNumber(clientId),
            }
        );
    }

    @MapErrors({ errorCode: ec.EXTERNAL_IO_CALL_ERR })
    @LogErrors()
    async getClientPublishedCompetencies(modelGuid: string, modelVersion: string, locale: string): Promise<Nullable<CompetencyRaw[]>> {
        return await this.sql.query(`
                exec CMM.dbo.GetClientPublishedCompetencies
                    @CompetencyModelGUID = :modelGuid,
                    @CompetencyModelVersion = :modelVersion,
                    @In_Locale = :LCID
            `,
            {
                LCID: toLocale(locale),
                modelGuid: toStringOr(modelGuid),
                modelVersion: toStringOr(modelVersion)
            }
        );
    }

    @MapErrors({ errorCode: ec.EXTERNAL_IO_CALL_ERR })
    @LogErrors()
    async getBulkBCClientsCompetencyLevels(clientId: number, locale: string, subCategoryList: string): Promise<Nullable<CompetencyLevelRaw[]>> {
        return await this.sql.query(`
                exec SuccessProfile.dbo.GetBulkBCClientsCompetencyLevels
                    @ClientID = :clientId,
                    @LCID = :LCID,
                    @SubCategoryList = :subCategoryList
            `,
            {
                clientId: toNumber(clientId),
                LCID: toLocale(locale),
                subCategoryList: toStringOr(subCategoryList)
            }
        );
    }

    @LogErrors()
    async insertBulkMapItemId(clientId: number, userId: number, itemType: string = 'BEHAVIOR_COMPETENCY'): Promise<void> {
        await this.sql.query(`
                insert into
                    CMM.dbo.ItemModificationProfilesBulkUpdate (
                        ItemType,
                        ClientId,
                        ModifiedBy,
                        InsertDate,
                        PublishDate,
                        PublishingStatus
                    )
                    select
                        :itemType,
                        :clientId,
                        :userId,
                        getDate(),
                        null,
                        0
            `,
            {
                itemType: toStringOr(itemType),
                clientId: toNumber(clientId),
                userId: toNumber(userId),
            }
        );
    }

    @LogErrors()
    async selectBulkMapItemId(clientId: number, itemType: string = 'BEHAVIOR_COMPETENCY'): Promise<[selectBulkMapItemId]> {
        return await this.sql.query(`
                select TOP 1
                    ItemModificationID
                from
                    CMM.dbo.ItemModificationProfilesBulkUpdate
                where
                    ItemType = :itemType
                        and
                    ClientId = :clientId
                order by
                    insertDate desc
            `,
            {
                itemType: toStringOr(itemType),
                clientId: toNumber(clientId),
            }
        );
    }

    @MapErrors({ errorCode: ec.EXTERNAL_IO_CALL_ERR })
    @LogErrors()
    async selectClientPublishedSkills(query: SkillsQueryProps): Promise<SkillsResponseFromDB[]> {
        return await this.sql.query(`
                exec SuccessProfile.dbo.GetClientPublishedSkills
                    :ClientId,
                    :LCID
            `,
            {
                ClientId: toNumber(query.preferredClientId),
                LCID: toLocale(query.preferredLocale)
            }
        );
    }

    @MapErrors({ errorCode: ec.EXTERNAL_IO_CALL_ERR })
    @LogErrors()
    async getBulkMappingPublishStatus(query: BulkPublishStatusQueryParams): Promise<BulkPublishStatusDBResponse[]> {
        return await this.sql.query(`
                exec CMM.dbo.GetClientModelsStatuses
                    @ClientId = :clientId,
                    @LCID = :LCID
            `,
            {
                clientId: toNumber(query.preferredClientId),
                LCID: toLocale(query.preferredLocale)
            }
        );
    }
}
