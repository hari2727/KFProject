import { Injectable } from '@nestjs/common';
import { ProfileVersionsQuery, ProfileVersionsRawResponse } from './profile-versions.interface';
import { LogErrors } from '../_shared/log/log-errors.decorator';
import { toNumber } from '../_shared/convert';
import { TypeOrmHelper } from '../_shared/db/typeorm.helper';

@Injectable()
export class ProfileVersionsRepository {

    constructor(protected sql: TypeOrmHelper) {
    }

    @LogErrors()
    async getProfileVersionDetails(query: ProfileVersionsQuery): Promise<ProfileVersionsRawResponse[]> {
        return await this.sql.query(`
                exec SuccessProfile.dbo.Get_ClientJobAllVersions
                    @ClientJobID = :ClientJobId,
                    @ClientID = :ClientId
            `,
            {
                ClientJobId: toNumber(query.successProfileId),
                ClientId: toNumber(query.loggedInUserClientId),
            }
        );
    }
}
