import { DataSource, Repository } from 'typeorm';
import { AppCode as ec } from '../../../../app.const';
import { KfhubCountryEntity } from './kftarc-country.entity';
import { MapErrors } from '../../../../_shared/error/map-errors.decorator';
import { LogErrors } from '../../../../_shared/log/log-errors.decorator';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KfhubCountryRepository extends Repository<KfhubCountryEntity> {

    protected countries;

    constructor(dataSource: DataSource) {
        super(KfhubCountryEntity, dataSource.createEntityManager());
    }

    @MapErrors({ errorCode: ec.COUNTRY_LIST_ERR })
    @LogErrors()
    async getAllCountries() {
        if (!this.countries) {
            this.countries = await this.query(`
                SELECT distinct
                    *
                FROM
                    SuccessProfile.dbo.THAryaCountryMapping
            `);
        }
        return this.countries;
    }
}
