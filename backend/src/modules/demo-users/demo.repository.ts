import { Injectable } from '@nestjs/common';
import { AppCode as ec } from '../../app.const';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { toNumber } from '../../_shared/convert';
import { TypeOrmHelper } from '../../_shared/db/typeorm.helper';

@Injectable()
export class DemoUsersRepository {

    constructor(protected sql: TypeOrmHelper) {
    }

    async getUsersPrivacyTimeoutFlag(clientId: number, userId: number): Promise<boolean> {
        const result = await this.sql.query(`
                exec SuccessProfile.dbo.GetUsersPrivacyTimeoutFlag
                    @ClientId = :clientId,
                    @UserId = :userId
            `,
            {
                clientId: toNumber(clientId),
                userId: toNumber(userId)
            }
        );
        return Boolean(result && result.length && Number(result[0].TimeOut) === 1);
    }

    @LogErrors()
    async updateUsersPrivacyResponseDate(clientId: number, userId: number): Promise<void> {
        const response = await this.sql.query(`
                exec SuccessProfile.dbo.UpdateUsersPrivacyResponseDate
                    @ClientId = :clientId,
                    @UserId = :userId
            `,
            {
                clientId: toNumber(clientId),
                userId: toNumber(userId)
            }
        );
        if (response[0]?.ExceptionCode !== ec.SUCCESS) {
            throw response[0];
        }
    }
}
