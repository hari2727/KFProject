import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AppCode as ec } from '../../app.const';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { TypeOrmHelper } from '../../_shared/db/typeorm.helper';

@Injectable()
export class SchedulerService {

    constructor(protected sql: TypeOrmHelper) {
    }

    @Cron('0 */15 * * * *')
    @LogErrors()
    async publishBulkBCsToClientCustomSPs() {
        const response = await this.sql.query(`
                exec SuccessProfile.dbo.PublishBulkBCsToClientCustomSPs
            `,
            {}
        );
        if (response[0]?.ExceptionCode !== ec.SUCCESS) {
            throw response[0];
        }
    }

    @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
    @LogErrors()
    async cleanupDemoClientsData() {
        const response = await this.sql.query(`
                exec CMM.dbo.CleanupClientModels
                    @ClientId = :demoClientId,
                    @FeatureID = :featureId
            `,
            {
                demoClientId: 14193,
                featureId: 21
            }
        );

        if (response[0]?.ExceptionCode !== ec.SUCCESS) {
            throw response[0];
        }
    }
}
