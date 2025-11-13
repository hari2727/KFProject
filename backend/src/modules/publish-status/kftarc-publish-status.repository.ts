import { Repository } from 'typeorm';
import { PublishStatusEntity } from './kftarc-publish-status.entity';
import { PublishStatusQuery, RawPublishStatus } from './kftarc-publish-status.interface';
import { PublishStatus } from './kftarc-publish-status.enum';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { Injectable } from '@nestjs/common';
import { toLocale, toNumber, toStringOr } from '../../_shared/convert';
import { KfTarcRolesInterface as Kf } from '../roles/kftarc-roles.interface';
import { TypeOrmHelper } from '../../_shared/db/typeorm.helper';

@Injectable()
export class PublishStatusRepository extends Repository<PublishStatusEntity> {

    constructor(protected sql: TypeOrmHelper) {
        super(PublishStatusEntity, sql.dataSource.createEntityManager());
    }

    @LogErrors()
    async getPublishStatusData(query: PublishStatusQuery): Promise<RawPublishStatus[]> {
        // pageIndex=0&pageSize=0&sortColumn=PROFILE_NUMBER&sortBy=asc&publishType=&locale=en&userId=26406&loggedInUserClientId=23139 in 69.258
        return await this.sql.query(`
                exec CMM.dbo.GetBulkUploadPublishingStatuses
                    @In_ClientID = :ClientID,
                    @In_pageIndex = :pageIndex,
                    @In_pageSize = :pageSize,
                    @In_sortColumn = :sortColumn,
                    @In_sortBy = :sortBy,
                    @In_LCID = :LCID,
                    @In_PublishType = :PublishType
            `,
            {
                ClientID: toNumber(query.loggedInUserClientId),
                pageIndex: toNumber(query.pageIndex, 0) || 0,
                pageSize: toNumber(query.pageSize, 0) || Kf.Defaults.pageSize,
                sortColumn: toStringOr(query.sortColumn),
                sortBy: toStringOr(query.sortBy),
                LCID: toLocale(query.locale),
                PublishType: toStringOr(query?.publishType) || null,
            }
        );
    }

    @LogErrors()
    async updateBulkBCPublishingStatus(clientId: number, itemModificationId: number, publishStatus: PublishStatus): Promise<void> {
        await this.sql.query(`
                exec CMM.dbo.UpdateBulkBCPublishingStatus
                    @In_ClientID = :ClientID,
                    @In_ItemModificationID = :ItemModificationID,
                    @In_PublishStatus = :PublishStatus
            `,
            {
                ClientID: toNumber(clientId),
                ItemModificationID: toNumber(itemModificationId),
                PublishStatus: toStringOr(publishStatus),
            }
        );
    }
}
