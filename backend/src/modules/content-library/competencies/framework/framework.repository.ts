import { DataSource } from 'typeorm';
import { TranslationDBResponse, TranslationsQuery } from './framework.interface';
import { LogErrors } from '../../../../_shared/log/log-errors.decorator';
import { Injectable } from '@nestjs/common';
import { escapeAndRunQueryWithParams } from '../../../../_shared/db/typeorm';
import { TypeOrmHelper } from '../../../../_shared/db/typeorm.helper';
import { toStringOr } from '../../../../_shared/convert';

@Injectable()
export class FrameworkRepository {

    constructor(protected sql: TypeOrmHelper) {
    }

    @LogErrors()
    async getLanguageTranslations(query: TranslationsQuery): Promise<TranslationDBResponse[]> {
        return await this.sql.query(`
                exec CMM.dbo.GetFactorClusterDetails
                    @InCompetencyModelID = :CompetencyModelId,
                    @InCompetencyModelVersion = :CompetencyModelVersion,
                    @InFactorID = :FactorID,
                    @InClusterID = :ClusterID
            `,
            {
                CompetencyModelId: toStringOr(query.competencyModelId),
                CompetencyModelVersion: toStringOr(query.competencyModelVersion),
                FactorID: toStringOr(query.factorId),
                ClusterID: toStringOr(query?.clusterId) || null,
            }
        );
    }

}
