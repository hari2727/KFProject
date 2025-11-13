import { DataSource, Repository } from 'typeorm';
import {
    ItemModificationProfilesBulkUpdateProfiles,
    ItemModificationSubCategory,
} from './bm-mssql.entity';
import { insertBulkMapProfile, insertBulkMapSubCategory } from './bm-mssql.i';
import { MssqlUtils } from '../../common/common.utils';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { Injectable } from '@nestjs/common';
import { toNumber } from '../../_shared/convert';

@Injectable()
export class ProfilesRepository extends Repository<ItemModificationProfilesBulkUpdateProfiles> {

    constructor(dataSource: DataSource) {
        super(ItemModificationProfilesBulkUpdateProfiles, dataSource.createEntityManager());
    }

    @LogErrors()
    async insertBulkMapProfiles(arr: insertBulkMapProfile[]): Promise<boolean> {
        await MssqlUtils.insertBigSet(arr.map(i => ({
            itemModificationId: toNumber(i.itemModificationId),
            clientJobId: toNumber(i.clientJobId),
        })), this);
        return true;
    }
}

@Injectable()
export class SubCategoryRepository extends Repository<ItemModificationSubCategory> {

    constructor(dataSource: DataSource) {
        super(ItemModificationSubCategory, dataSource.createEntityManager());
    }

    @LogErrors()
    async insertBulkMapSubCategory(arr: insertBulkMapSubCategory[]): Promise<boolean> {
        await MssqlUtils.insertBigSet(arr.map(i => ({
            itemModificationId: toNumber(i.itemModificationId),
            competencyId: toNumber(i.competencyId),
            levelId: toNumber(i.levelId),
            order: toNumber(i.order),
        })), this);
        return true;
    }
}
