import { AppCode as ec } from '../../app.const';
import { Repository } from 'typeorm';
import { KfTarcContentEntity } from './kftarc-content.entity';
import { KfTarcContentInterface as Kf } from './kftarc-content.interface';
import { MapErrors } from '../../_shared/error/map-errors.decorator';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { Injectable } from '@nestjs/common';
import { toLocale, toNumber, toStringOr } from '../../_shared/convert';
import { TypeOrmHelper } from '../../_shared/db/typeorm.helper';

@Injectable()
export class KfTarchContentRepository extends Repository<KfTarcContentEntity> {

    constructor(protected sql: TypeOrmHelper) {
        super(KfTarcContentEntity, sql.dataSource.createEntityManager());
    }
    /*
    Get Learning assets by job id failed
 */
    @MapErrors({ errorCode: ec.LA_JOB_ID_ERR })
    @LogErrors()
    async getLearningAssetsByJobId(clientId: number, clientJobId: string, locale: string): Promise<Kf.ContentBody[]> {
        return await this.sql.query(`
                exec SuccessProfile.dbo.GetLearningAssetsByJobId
                    :clientId,
                    :clientJobId,
                    :locale
            `,
            {
                clientId: toNumber(clientId),
                clientJobId: toNumber(clientJobId),
                locale: toLocale(locale)
            }
        );
    }
    /*
   Get Learning assets by comps job id failed
 */
    @MapErrors({ errorCode: ec.LA_COMPS_JOB_ID_ERR })
    @LogErrors()
    async getLearningAssetsByCompsRoleLevelsSP(clientId: number, compRoleLevel: string, locale: string) {
        return await this.sql.query(`
                exec SuccessProfile.dbo.GetLearningAssetsByComps_RoleLevels
                    :clientId,
                    :compRoleLevel,
                    :locale
            `,
            {
                clientId: toNumber(clientId),
                compRoleLevel: toNumber(compRoleLevel),
                locale: toLocale(locale)
            }
        );
    }
    /*
    Get Learning assets by comps job id failed
 */
    @MapErrors({ errorCode: ec.LA_COMPS_ROLE_LEVELS_ERR })
    @LogErrors()
    async getLearningAssetByCompsJobId(clientId: number, behComps: string, techComps: string, jobId: number, lcid: string) {
        return await this.sql.query(`
                exec SuccessProfile.dbo.GetLearningAssetsByComps_JobID
                    :clientId,
                    :behComps,
                    :techComps,
                    :jobId,
                    :locale
            `,
            {
                clientId: toNumber(clientId),
                behComps: toStringOr(behComps),
                techComps: toStringOr(techComps),
                jobId: toNumber(jobId),
                locale: toLocale(lcid),
            }
        );
    }
}
