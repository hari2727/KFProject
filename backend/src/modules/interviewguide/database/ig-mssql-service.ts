import { Injectable } from '@nestjs/common';
import { CompetencyModel, CustomContent } from '../model/ig-mssql.i';
import { AppCode as ec } from '../../../app.const';
import { MapErrors } from '../../../_shared/error/map-errors.decorator';
import { LogErrors } from '../../../_shared/log/log-errors.decorator';
import { Nullable } from '../../../_shared/types';
import { toLocale, toNumber, toStringOr } from '../../../_shared/convert';
import { TypeOrmHelper } from '../../../_shared/db/typeorm.helper';

@Injectable()
export class IgMssqlService {

    constructor(protected sql: TypeOrmHelper) {
    }

    @MapErrors({ errorCode: ec.EXTERNAL_CALL_ERR })
    @LogErrors()
    async getCustomComps(clientId: number, localeArg = 'en-US'): Promise<Nullable<CustomContent[]>> {
        const locale = localeArg === 'en' ? 'en-US' : toLocale(localeArg, 'en-US');

        const competencyModel: CompetencyModel[] = await this.sql.query(`
                select TOP 1
                    CompetencyModelVersion,
                    CompetencyModelGUID
                from
                    CMM.dbo.CompetencyModel
                where
                    ClientID = :clientId
                        and
                    LCID = :locale
                        and
                    CompetencyModelStatusId = 3
                order by
                    CreatedOn desc,
                    ModifiedOn desc
            `,
            {
                locale: toLocale(locale),
                clientId: toNumber(clientId),
            }
        );

        if (competencyModel.length > 0) {
            return await this.sql.query(`
                    exec CMM.dbo.GetClientCustomCompetencies
                        :modelGuid,
                        :modelVersion,
                        :locale
                `,
                {
                    locale: toLocale(locale),
                    modelGuid: competencyModel[0]?.CompetencyModelGUID,
                    modelVersion: toStringOr(competencyModel[0]?.CompetencyModelVersion),
                }
            );
        }
        return null;
    }
}
