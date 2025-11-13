import { Repository } from 'typeorm';
import {
    DbResponse,
    KfTarcSuccessProfileMatrixEntity,
    MatrixProfilesDataSetNames,
    MatrixProfilesDataStream
} from './kftarc-sp-matrix.entity';
import { KfTarcSpMatrixProfilesParams } from './kftarc-sp-matrix.interface';
import { AppCode as ec } from '../../app.const';
import { MapErrors } from '../../_shared/error/map-errors.decorator';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { Injectable } from '@nestjs/common';
import { toLocale, toNumber } from '../../_shared/convert';
import { KfTarcRolesInterface as Kf } from '../roles/kftarc-roles.interface';
import { TypeOrmHelper } from '../../_shared/db/typeorm.helper';

@Injectable()
export class KfTarcSpMatrixRepository extends Repository<KfTarcSuccessProfileMatrixEntity> {

    constructor(protected sql: TypeOrmHelper) {
        super(KfTarcSuccessProfileMatrixEntity, sql.dataSource.createEntityManager());
    }

    @MapErrors({ errorCode: ec.MATRIX_SUCCESS_PROFILES_ERR })
    @LogErrors()
    async getPmMatrixProfiles(filterValues: KfTarcSpMatrixProfilesParams): Promise<DbResponse> {
        const resultSets = await this.sql.queryDataSets<MatrixProfilesDataStream>(`
                exec SuccessProfile.dbo.GetPMMatrixProfiles
                    @In_ClientID = :clientId,
                    @SectionProductId = :sectionProductId,
                    @In_Function = :functions,
                    @In_SubFunction = :subFunctions,
                    @In_ProfileType = :profileTypes,
                    @In_CreatedBy = :createdBy,
                    @In_profileCollectionIDs = :profileCollections,
                    @In_Locale = :locale,
                    @In_pageIndex = :pageIndex,
                    @In_pageSize = :pageSize,
                    @In_UserID = :userId
            `,
            {
                clientId: toNumber(filterValues.clientId),
                sectionProductId: toNumber(filterValues.sectionProductId),
                functions: filterValues.functions,
                subFunctions: filterValues.subFunctions,
                profileTypes: filterValues.profileTypes,
                createdBy: filterValues.createdBy,
                profileCollections: filterValues.profileCollections,
                locale: toLocale(filterValues.locale),
                pageIndex: toNumber(filterValues.pageIndex, 0) || Kf.Defaults.pageIndex,
                pageSize: toNumber(filterValues.pageSize, 0) || Kf.Defaults.pageSize,
                userId: toNumber(filterValues.userId)
            }
        );
        return {
            amount: resultSets[MatrixProfilesDataSetNames.TOTAL_RECORDS] || [],
            entries: resultSets[MatrixProfilesDataSetNames.DATA] || []
        };
    }
}
