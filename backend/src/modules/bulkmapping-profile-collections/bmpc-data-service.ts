import { Injectable } from '@nestjs/common';
import { getUAMPointRestriction } from '../../common/common.utils';
import { KfFilterMetadataDTO } from '../../common/metadata.filter.i';
import {
    BMPCAddChangeDTO,
    BMPCCopyChangesDTO,
    BMPCGetBulkPCProfileDetailsDTO,
    BMPCGetFiltersMetadataOptions,
    BMPCProfileCollection,
    BMPCProfilesSearchDataStream,
    BMPCRemoveChangesDTO,
    BMPCSearchProfilesRequestDBOptions
} from './bmpc.types';
import { extractSpecificFilters } from '../../common/metadata.filter';
import { MssqlDataSets } from '../bulkmapping/bm.enum';
import { BulkStagingClientJobDTO, OperationId } from '../../bulk-update/bulk-update.types';
import { BulkOperation } from '../../bulk-update/bulk-update.const';
import { toBit, toLocale, toNumber, toStringOr } from '../../_shared/convert';
import { TypeOrmHelper } from '../../_shared/db/typeorm.helper';

@Injectable()
export class BulkMappingProfileCollectionsDataService {

    constructor(protected sql: TypeOrmHelper) {
    }

    async obtainViewOperationId(clientId: number, userId: number, operation: BulkOperation): Promise<OperationId> {
        const response = await this.sql.query(`
                DECLARE @Output TABLE (
                    ItemModificationID BIGINT
                );
                INSERT INTO
                    CMM.dbo.ItemModificationBulkViewPC (
                        ItemType
                    )
                    OUTPUT
                        INSERTED.ItemModificationID
                    INTO @Output
                        SELECT :operation;

                SELECT
                    *
                FROM
                    @Output;
            `,
            {
                operation: toStringOr(operation)
            }
        );

        if (!response?.length) {
            throw `Error while obtaining ItemModificationId : ${userId} at ${clientId}, ${operation}`;
        }
        return Number(response[0].ItemModificationID);
    }

    async addProfilesIntoView(DTOs: BulkStagingClientJobDTO[]): Promise<void> {
        await this.sql.insert(
            DTOs,
            'CMM.dbo.ItemModificationBulkViewPCProfiles',
            [
                'ItemModificationID',
                'ClientJobID',
            ],
            dto => [
                toNumber(dto.operationId),
                toNumber(dto.clientJobId),
            ]
        );
    }

    async getFilters(options: BMPCGetFiltersMetadataOptions): Promise<KfFilterMetadataDTO[]> {
        const restriction = getUAMPointRestriction(options.permissions);

        return await this.sql.query(`
                exec SuccessProfile.dbo.GetBulkPCUpdateMetadata
                    @in_InputClientID = :clientId,
                    @in_InputLocale = :locale,
                    @in_IsExec = :isExec,
                    @in_AccessPoints = :pointValue,
                    @WCToggle = :wcToggle,
                    @ItemModificationId = :operationId,
                    @IsView = :isView
            `,
            {
                clientId: toNumber(options.clientId),
                locale: toLocale(options.locale),
                isExec: toNumber(restriction.isExec),
                pointValue: toNumber(restriction.pointValue),
                wcToggle: toBit(options.wcToggle),
                operationId: toNumber(options.operationId),
                isView: toBit(options.isView)
            }
        );
    }

    async searchProfiles(options: BMPCSearchProfilesRequestDBOptions): Promise<BMPCGetBulkPCProfileDetailsDTO[]> {
        const restrictions = getUAMPointRestriction(options.permissions);
        const filters = extractSpecificFilters(options.filterBy, options.filterValues, [
            'HIDEJOBINPM',
            'PROFILE_COLLECTIONS',
            'LEVELS',
        ]);

        let hideJobInPMFilter = filters.specific['HIDEJOBINPM'];
        let profileCollectionsFilter = filters.specific['PROFILE_COLLECTIONS'];
        let levelsFilter = filters.specific['LEVELS'];

        const result = await this.sql.queryDataSets<BMPCProfilesSearchDataStream>(`
                exec SuccessProfile.dbo.GetBulkPCProfileDetails
                    ${ hideJobInPMFilter ? '@in_HideJobInPM = :hideJobInPMFilter,' : '' }
                    ${ profileCollectionsFilter ? '@In_ProfileCollectionIDs = :profileCollectionsFilter,' : '' }
                    ${ levelsFilter ? '@In_LevelFilter = :levelsFilter,' : '' }
                    @in_ClientID = :clientId,
                    @in_sortColumn = :sortColumn,
                    @in_sortBy = :sortBy,
                    @in_searchString = :searchString,
                    @in_searchColumn = :searchColumn,
                    @in_filterBy = :filterBy,
                    @in_filterValues = :filterValues,
                    @in_InputLocale = :locale,
                    @in_pageIndex = :pageIndex,
                    @in_pageSize = :pageSize,
                    @in_IsExec = :isExec,
                    @in_AccessPoints = :accessPoints,
                    @WCToggle = :wcToggle,
                    @ItemModificationID = :operationId,
                    @IsView = :isView
            `,
            {
                clientId: toNumber(options.clientId),
                sortColumn: options.sortColumn || null,
                sortBy: options.sortBy || null,
                searchColumn: options.searchColumn || null,
                searchString: options.searchString || null,
                filterBy: filters.filterBy || null,
                filterValues: filters.filterValues || null,
                locale: toLocale(options.locale, 'en'),
                pageIndex: 1,
                pageSize: 20000,
                isExec: toNumber(restrictions.isExec),
                accessPoints: restrictions.pointValue || 200,
                wcToggle: toBit(options.wcToggle),
                operationId: toNumber(options.operationId, 0),
                isView: toBit(options.isView),
                hideJobInPMFilter,
                profileCollectionsFilter,
                levelsFilter
            }
        );

        return result[MssqlDataSets.DATA_RAW];
    }

    async getClientProfileCollections(clientId: number): Promise<BMPCProfileCollection[]> {
        return await this.sql.query(`
                SELECT
                    ProfileCollectionID profileCollectionsId,
                    ProfileCollectionsName profileCollectionsName
                FROM
                    ProductAdmin.dbo.view_ProfileCollectionUserPrimaryAndSecondaryGroupsDetails_DA
                WHERE
                    clientid = :clientId
            `,
            {
                clientId: toNumber(clientId)
            }
        );
    }

    async addProfileCollectionAssignmentChanges(DTOs: BMPCAddChangeDTO[]): Promise<void> {
        await this.sql.insert(
            DTOs,
            'CMM.dbo.ItemModificationBulkEditProfileCollection',
            [
                'ItemModificationID',
                'ClientJobID',
                'ProfileCollectionID',
            ],
            dto => [
                toNumber(dto.operationId),
                toNumber(dto.successProfileId),
                dto.profileCollectionIds,
            ]
        );
    }

    async removeProfileCollectionAssignmentChanges(DTO: BMPCRemoveChangesDTO): Promise<void> {
        return await this.sql.query(`
                DELETE FROM
                    CMM.dbo.ItemModificationBulkEditProfileCollection
                WHERE
                    ItemModificationID = :operationId
                        AND
                    ClientJobID IN (${ DTO.successProfileIds.map(i => toNumber(i)).join(',') })
            `,
            {
                operationId: toNumber(DTO.operationId),
                // successProfileIds: DTO.successProfileIds.map(i => toNumber(i))
            }
        );
    }

    async copyProfileCollectionAssignmentChanges(DTO: BMPCCopyChangesDTO): Promise<void> {
        return await this.sql.query(`
                INSERT INTO
                    CMM.dbo.ItemModificationBulkMapProfileCollection
                SELECT
                    :mapOperationId as ItemModificationID,
                    ClientJobID,
                    ProfileCollectionID ProfileCollectionsID
                FROM
                    CMM.dbo.ItemModificationBulkEditProfileCollection
                WHERE
                    ItemModificationID = :viewOperationId
            `,
            {
                mapOperationId: toNumber(DTO.mapOperationId),
                viewOperationId: toNumber(DTO.viewOperationId)
            }
        );
    }

}
