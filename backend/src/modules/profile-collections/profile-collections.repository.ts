import { Injectable } from '@nestjs/common';
import { ProfileCollectionsRawResponse } from './profile-collections.interface';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { toNumber } from '../../_shared/convert';
import { TypeOrmHelper } from '../../_shared/db/typeorm.helper';

@Injectable()
export class ProfileCollectionsRepository {

    constructor(protected sql: TypeOrmHelper) {
    }

    @LogErrors()
    async getProfileCollections(clientId: number, userId: number): Promise<ProfileCollectionsRawResponse[]> {
        return await this.sql.query(`
                exec SuccessProfile.dbo.GetProfileCollectionForUser
                    @In_ClientID = :clientId,
                    @In_UserID = :userId
            `,
            {
                clientId: toNumber(clientId),
                userId: toNumber(userId)
            }
        );
    }
}
