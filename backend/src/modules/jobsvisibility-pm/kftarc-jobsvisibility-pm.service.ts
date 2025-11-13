import { AppCode as ec } from '../../app.const';
import { KfTarcPMJobsVisibilityStatusInterface as Kf } from './kftarc-jobsvisibility-pm.interface';
import { Injectable } from '@nestjs/common';
import { QueryProps } from '../../common/common.interface';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { MapErrors } from '../../_shared/error/map-errors.decorator';
import { toBit, toNumber } from '../../_shared/convert';
import { TypeOrmHelper } from '../../_shared/db/typeorm.helper';

@Injectable()
export class KfTarcPMJobsVisibilityStatusService {

    constructor(protected sql: TypeOrmHelper) {
    }

    @MapErrors({ errorCode: ec.EXTERNAL_CALL_ERR })
    @LogErrors()
    async updateVisibilityStatus(queryParams: QueryProps.Default, body: Kf.StatusDTO): Promise<Kf.StatusDTO> {
        const data = await this.sql.query(`
                exec SuccessProfile.dbo.KFArchitectBulkUpdateHideJobs
                    :clientId,
                    :hideJobInPM
            `,
            {
                clientId: toNumber(queryParams.loggedInUserClientId),
                hideJobInPM: toBit(body.status),
            }
        ) as Kf.MutationDataBaseResponse[];

        if (data[0].ExceptionCode === Kf.MutationExceptionCodes.SUCCESS) {
            return {
                status: data[0].StatusCode,
            };
        }

        throw `Error in updating status`;
    }

    @LogErrors()
    async getVisibilityStatus(queryParams: QueryProps.Default): Promise<Kf.StatusDTO> {
        const data = await this.sql.query(`
                exec SuccessProfile.dbo.GetKFArchitectHideJobInPMStatus
                    :clientId
            `,
            {
                clientId: toNumber(queryParams.loggedInUserClientId),
            }
        ) as Kf.QueryDataBaseResponse[];

        return {
            status: data[0].HideStatus
        };
    }
}
