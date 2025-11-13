import { BadRequestException, Injectable } from '@nestjs/common';
import { Translation, TranslationDBResponse, TranslationsQuery } from './framework.interface';
import { FrameworkRepository } from './framework.repository';
import { LogErrors } from '../../../../_shared/log/log-errors.decorator';

@Injectable()
export class FrameworkService {

    constructor(protected frameworkRepository: FrameworkRepository) {}

    @LogErrors()
    async getLanguageCompetencies(query: TranslationsQuery): Promise<Translation[]> {
        if (this.validateQueryParams(query)) {
            throw new BadRequestException('Missing required parameters');
        }
            const dbResponse: TranslationDBResponse[] = await this.frameworkRepository.getLanguageTranslations(query);
            return this.mapResponse(dbResponse, query.clusterId);
    }

    protected validateQueryParams(query: TranslationsQuery): boolean {
        return !query?.competencyModelId || !query?.competencyModelVersion || !query?.factorId;
    }

    protected mapResponse(dbResponse: TranslationDBResponse[], clusterId: string): Translation[] {
        return (dbResponse || []).map((data: TranslationDBResponse) => {
            return {
                locale: data.LCID,
                factorName: data.FactorName,
                ...(clusterId ? { clusterName: data.ClusterName } : {}),
            };
        });
    }
}
