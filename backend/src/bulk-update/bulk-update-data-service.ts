import { BulkOperation } from './bulk-update.const';
import { Injectable } from '@nestjs/common';
import { BulkStagingClientJobDTO, OperationId } from './bulk-update.types';
import { toNumber, toStringOr } from '../_shared/convert';
import { TypeOrmHelper } from '../_shared/db/typeorm.helper';

@Injectable()
export class BulkUpdateDataService {

    constructor(protected sql: TypeOrmHelper) {
    }

    async obtainBulkOperationId(clientId: number, userId: number, operation: BulkOperation): Promise<OperationId> {
        const response = await this.sql.query(`
                DECLARE @Output TABLE (ItemModificationID BIGINT);
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
                    @Output
                ;
            `,
            {
                itemType: toStringOr(operation),
                clientId: toNumber(clientId),
                userId: toNumber(userId)
            }
        );

        if (!response?.length) {
            throw `Error while obtaining ItemModificationId : ${userId} at ${clientId}, ${operation}`;
        }
        return Number(response[0].ItemModificationID);
    }

    async insertStagingClientJobs(DTOs: BulkStagingClientJobDTO[]): Promise<void> {
        await this.sql.insert(
            DTOs,
            'CMM.dbo.ItemModificationProfilesBulkUpdateProfiles',
            [
                'ItemModificationID',
                'ClientJobID',
            ],
            dto => [
                toNumber(dto.operationId),
                toNumber(dto.clientJobId),
            ]
        );
    }
}
