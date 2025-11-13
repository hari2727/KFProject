import { Injectable } from '@nestjs/common';
import { GetJobDescriptionCompanyCompanyDetailsOptions, JobDescriptionCompanyCompanyDetailsDTO } from './jdcd.types';
import { toLocale, toNumber } from '../../_shared/convert';
import { TypeOrmHelper } from '../../_shared/db/typeorm.helper';

@Injectable()
export class JobDescriptionCompanyDetailsDataService {

    constructor(protected sql: TypeOrmHelper) {
    }

    async getCompanyDetailsDTOs(options: GetJobDescriptionCompanyCompanyDetailsOptions): Promise<JobDescriptionCompanyCompanyDetailsDTO[]> {
        return (
                await this.sql.query(`
                        SELECT
                            *
                        FROM
                            Activate.dbo.ClientTranslations
                        WHERE
                            ClientId = :clientId
                                AND
                            LCID = :locale
                                AND
                            TranslationColumnId = 1
                    `,
                    {
                        clientId: toNumber(options.clientId),
                        locale: toLocale(options.locale, 'en')
                    }
                )
        ).map(i => ({

            clientId: Number(i['ClientID']),
            locale: i['LCID'],
            aboutCompany: i['TranslatedText'],
            applyToAllJobDescriptions: Boolean(Number(i['ApplyToAllJobDescriptions']))

        }));
    }

}
