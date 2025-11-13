import { Injectable } from '@nestjs/common';
import { PublishStatusRepository as PublishStatusRepository } from './kftarc-publish-status.repository';
import {
    OptionsResponse,
    Paging,
    PublishStatusQuery,
    RawPublishStatus as statusData,
    Records as formatOptions,
    RepublishPayload,
} from './kftarc-publish-status.interface';
import { QueryProps } from '../../common/common.interface';
import { okResponse } from '../../common/common.utils';
import { PublishStatus, PutActions } from './kftarc-publish-status.enum';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { safeString } from '../../_shared/safety';

@Injectable()
export class PublishStatusService {
    constructor(
        protected repository: PublishStatusRepository,
    ) {}

    @LogErrors()
    async getPublishStatus(query: PublishStatusQuery): Promise<OptionsResponse> {
            const data = await this.repository.getPublishStatusData(query);
            const publishedRecords = this.formattPublishStatusStatusOptions(data);
            const paging = publishedRecords?.length
                ? this.getPaging(publishedRecords[0], query)
                : { pageIndex: 0, pageSize: 0, totalPages: 0, totalPublishedRecords: 0 };
            return {
                publishedRecords: publishedRecords,
                paging: paging,
            };
    }

    formattPublishStatusStatusOptions(dbData: statusData[]): formatOptions[] {
        return (dbData || []).map(row => {
            return {
                id: row.ItemModificationID,
                publishedStatus: row.PublishStatus,
                publishedDate: row.PublishedDate,
                RequestPublishDate: row.RequestPublishDate,
                successProfilesCount: row.ProfileNumber,
                competenciesDataCount: row.CompetencyNumber,
                totalPublishedRecords: row.TotalPublishedRecords,
                publishType: row.PublishType,
                requester: {
                    uid: row.PersonId,
                    firstName: row.FirstName,
                    lastName: row.LastName,
                    fullName: row.FirstName + row.LastName,
                },
            };
        });
    }

    getPaging(data, query: any): Paging {
        const totalRecords = data.totalPublishedRecords;
        const pages = Number(Math.ceil(data.totalPublishedRecords / query.pageSize));
        return {
            pageIndex: Number(query.pageIndex),
            pageSize: Number(query.pageSize),
            totalPages: pages,
            totalPublishedRecords: totalRecords,
        };
    }

    @LogErrors()
    async actionSwitcher(action: string, query: QueryProps.Default, body: RepublishPayload): Promise<any> {
        switch (action) {
            case PutActions.REPUBLISH:
                return await this.republishMapping(query, body);
            default:
                throw safeString(`PUT publish-status: unknown action "${action}"`);
        }
    }

    @LogErrors()
    async republishMapping(query: QueryProps.Default, body: RepublishPayload): Promise<any> {
            await this.repository.updateBulkBCPublishingStatus(query.loggedInUserClientId, +body.itemModification, PublishStatus.NOT_STARTED);
            return okResponse;
    }
}
