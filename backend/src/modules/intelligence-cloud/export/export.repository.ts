import { Injectable } from '@nestjs/common';
import { MssqlUtils } from '../../../common/common.utils';
import { ExportQueryParams, PageDataConfig, PageDataResponse } from './export.interface';
import { buildPageDataResponse } from './export.util';
import { toLocale, toNumber } from '../../../_shared/convert';
import { TypeOrmHelper } from '../../../_shared/db/typeorm.helper';

@Injectable()
export class IcExportRepository {

    constructor(protected sql: TypeOrmHelper) {
    }

    async getPageData(pageConfig: PageDataConfig, params: ExportQueryParams): Promise<PageDataResponse> {
        if (pageConfig.storedProcedureName) {
            const pageData = await this.sql.query(`
                    exec ${pageConfig.storedProcedureName}
                       :clientId,
                       :guid,
                       :locale,
                       :jobId,
                `,
                {
                    clientId: toNumber(params.clientId),
                    guid: params.guid,
                    locale: toLocale(params.locale),
                    jobId: toNumber(params.jobId),
                }
            ) as PageDataResponse;
            MssqlUtils.throwErrorOnIncorrectDbResponse(pageData);
            return pageData;
        }
        return pageConfig.data || buildPageDataResponse([]);
    }
}
