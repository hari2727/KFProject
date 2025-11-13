import { Repository } from 'typeorm';
import { SuccessProfileExportJSONEntity } from './json.entity';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { StoreJsonResponse } from './json.interface';
import { Injectable } from '@nestjs/common';
import { toNumber } from '../../_shared/convert';
import { TypeOrmHelper } from '../../_shared/db/typeorm.helper';

@Injectable()
export class SuccessProfileJsonRepository extends Repository<SuccessProfileExportJSONEntity> {

    constructor(protected sql: TypeOrmHelper) {
        super(SuccessProfileExportJSONEntity, sql.dataSource.createEntityManager());
    }

    async insertFullJson(clientId: number, id: number, json: object): Promise<StoreJsonResponse> {
        const now = new Date();
        await this.insert({
            id: toNumber(id),
            clientId: toNumber(clientId),
            json: JSON.stringify(json),
            modifiedOn: now,
            createdOn: now,
        });
        return {
            id,
            json,
            modifiedOn: now
        };
    }

    async updateFullJson(clientId: number, id: number, json: object): Promise<StoreJsonResponse> {
        const now = new Date();
        await this.update({
                id: toNumber(id),
                clientId: toNumber(clientId),
            }, {
                json: JSON.stringify(json),
                modifiedOn: now,
            });
        return {
            id,
            json,
            modifiedOn: now
        };
    }

    async selectFullJson(clientId: number, id: number): Promise<SuccessProfileExportJSONEntity> {
        return await this.findOneOrFail({
            where: {
                id: toNumber(id),
                clientId: toNumber(clientId),
            }
        });
    }

    async removeFullJson(clientId: number, ids: number[]): Promise<DeleteResult> {
        return await this.sql.query(`
                DELETE FROM
                    SuccessProfile.dbo.CachedSuccessProfilePDFJSON
                WHERE
                    ClientID = :clientId
                        AND
                    ClientJobID IN (${ ids.map(i => toNumber(i)).join(',') })
            `,
            {
                clientId: toNumber(clientId),
                // ids: ids.map(i => toNumber(i))
            }
        );
    }
}
