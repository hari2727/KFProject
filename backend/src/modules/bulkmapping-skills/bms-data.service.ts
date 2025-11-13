import { Injectable } from '@nestjs/common';
import {
    BulkMappingSkillsStagingItemModificationID,
    BulkMappingSkillsStagingProfileDTO,
    BulkMappingSkillsStagingSkillComponentDTO,
    BulkMappingSkillsStagingSkillLevelDTO,
} from './bms.interfaces';
import { toNumber, toStringOr } from '../../_shared/convert';
import { TypeOrmHelper } from '../../_shared/db/typeorm.helper';

@Injectable()
export class BulkMappingSkillsDataService {

    constructor(protected sql: TypeOrmHelper) {
    }

    async obtainItemModificationId(clientId: number, userId: number, itemType: string = 'SKILLS'): Promise<BulkMappingSkillsStagingItemModificationID[]> {
        return await this.sql.query(`
                DECLARE @Output TABLE (
                    ItemModificationID BIGINT
                );

                INSERT INTO
                    CMM.dbo.ItemModificationProfilesBulkUpdate (
                        ItemType,
                        ClientID,
                        ModifiedBy,
                        InsertDate,
                        PublishingStatus
                    )
                OUTPUT
                    INSERTED.ItemModificationID
                INTO @Output
                    SELECT
                        :itemType,
                        :clientId,
                        :userId,
                        getDate(),
                        0
                    ;
                SELECT
                    *
                FROM
                    @Output;
            `,
            {
                itemType: toStringOr(itemType),
                clientId: toNumber(clientId),
                userId: toNumber(userId)
            }
        );
    }

    async insertStagingProfiles(DTOs: BulkMappingSkillsStagingProfileDTO[]): Promise<void> {
        await this.sql.insert(
            DTOs,
            'CMM.dbo.ItemModificationProfilesBulkUpdateProfiles',
            [
                'ItemModificationID',
                'ClientJobID',
            ],
            dto => [
                toNumber(dto.ItemModificationID),
                toNumber(dto.ClientJobID),
            ]
        );
    }

    async insertStagingSkillLevels(DTOs: BulkMappingSkillsStagingSkillLevelDTO[]): Promise<void> {
        await this.sql.insert(
            DTOs,
            'CMM.dbo.ItemModificationProfilesBulkUpdateLevels',
            [
                'ItemModificationId',
                'JobSubCategoryId',
                'JobLevelDetailOrder',
                'SectionDetailOrder',
            ],
            dto => [
                toNumber(dto.ItemModificationID),
                toNumber(dto.JobSubCategoryId),
                toNumber(dto.JobLevelDetailOrder),
                toNumber(dto.SectionDetailOrder),
            ]
        );
    }

    async insertStagingSkillComponents(DTOs: BulkMappingSkillsStagingSkillComponentDTO[]): Promise<void> {
        await this.sql.insert(
            DTOs,
            'CMM.dbo.ItemModificationProfilesBulkUpdateSkillComponents',
            [
                'ItemModificationId',
                'JobSubCategoryId',
                'JobSkillComponentName',
                'JobSubCategoryDependantOrder',
                'JobSkillComponentCode',
                'JobSkillComponentGUID'
            ],
            dto => [
                toNumber(dto.ItemModificationID),
                toNumber(dto.JobSubCategoryId),
                toStringOr(dto.JobSkillComponentName),
                toNumber(dto.JobSubCategoryDependantOrder),
                toStringOr(dto.JobSkillComponentCode),
                toStringOr(dto.JobSkillComponentGUID)
            ]
        );
    }
}
