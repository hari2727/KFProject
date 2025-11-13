import { Injectable } from '@nestjs/common';
import { BulkUpdateDataService } from '../../bulk-update/bulk-update-data-service';
import { BulkOperation } from '../../bulk-update/bulk-update.const';
import {
    BulkOperationIdPayload,
    BulkOperationIdQuery,
    BulkOperationIdResponse,
    DefaultQuery,
} from '../../bulk-update/bulk-update.types';
import { BulkMappingProfileCollectionsDataService } from './bmpc-data-service';
import { BulkUpdateDataMapper } from '../../bulk-update/bulk-update-data-mapper';
import {
    BMPCAddChangeDTO,
    BMPCAddChangesOptions,
    BMPCApplyChangesOperationIdResponse,
    BMPCApplyChangesOptions,
    BMPCChange,
    BMPCChangesPayload,
    BMPCGetBulkPCProfileDetailsDTO,
    BMPCGetFiltersOptions,
    BMPCGetFiltersQuery,
    BMPCProfileCollection,
    BMPCProfileDetails,
    BMPCSearchProfileResponse,
    BMPCSearchProfilesOptions,
    BMPCSearchProfilesPayload,
    BMPCSearchProfilesRequestDBOptions,
    BMPCSuccessProfileIdsPayload,
    ProfileCollectionId,
} from './bmpc.types';
import { UserService } from '../../common/user/user.service';
import { Request } from 'express';
import { anyTo01 } from '../../common/common.utils';
import { buildFiltersResponse, normalizeFiltersMetaData } from '../../common/metadata.filter';
import { KfFiltersResponse } from '../../common/metadata.filter.i';
import { buildProfileGradeInfo } from '../../common/grade';
import { mapBy } from '../../_shared/collection/collection';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { toBit, toLocale, toNumber } from '../../_shared/convert';

@Injectable()
export class BulkMappingProfileCollectionsService {

    constructor(
        protected userService: UserService,
        protected commonDataService: BulkUpdateDataService,
        protected commonDataMapper: BulkUpdateDataMapper,
        protected dataService: BulkMappingProfileCollectionsDataService,
    ) {}

    @LogErrors()
    async addProfiles(request: Request, query: DefaultQuery, body: BMPCSuccessProfileIdsPayload): Promise<BulkOperationIdResponse> {
        //ItemModificationBulkViewPC
        //ItemModificationBulkViewPCProfiles
            if (!body.successProfileIds?.length) {
                throw 'No successProfileIds provided';
            }

            const operationId = await this.dataService.obtainViewOperationId(query.loggedInUserClientId, query.userId, BulkOperation.profileCollections);
            const dtos = this.commonDataMapper.createStagingClientJobDTOs(operationId, body.successProfileIds);

            await this.dataService.addProfilesIntoView(dtos);

            const initialChanges: BMPCChange[] = (await this.searchProfilesUsingOptions({
                authtoken: String(request.headers.authtoken),
                clientId: query.loggedInUserClientId,
                userId: query.userId,
                locale: query.locale,
                searchString: '',
                searchColumn: 'JOB_TITLE',
                filterBy: '',
                filterValues: '',
                sortColumn: 'JOB_TITLE',
                sortBy: 'DESC',
                wcToggle: 1,
                pageIndex: 0,
                pageSize: 20000,
                isView: 1,
                operationId,
            })).successProfiles.map(i => ({
                successProfileIds: [ i.id ],
                profileCollectionIds: (i.profileCollections || []).map(k => k.profileCollectionsId)
            }));

            await this.addChangesUsingOptions({
                changes: initialChanges,
                clientId: query.loggedInUserClientId,
                skipVerifyProfileCollections: true,
                operationId,
            });

            return {
                operationId
            };
    }

    async getFilters(request: Request, query: BMPCGetFiltersQuery & BulkOperationIdQuery): Promise<KfFiltersResponse> {
        return await this.getFiltersUsingOptions({
            authtoken: String(request.headers.authtoken),
            clientId: query.loggedInUserClientId,
            userId: query.userId,
            wcToggle: query.wcToggle,
            operationId: query.operationId,
            isView: query.isView,
            locale: query.locale
        });
    }

    async searchProfiles(request: Request, query: DefaultQuery, body: BMPCSearchProfilesPayload): Promise<BMPCSearchProfileResponse> {
        return await this.searchProfilesUsingOptions({
            authtoken: String(request.headers.authtoken),
            clientId: query.loggedInUserClientId,
            userId: query.userId,
            locale: query.locale,
            operationId: body.operationId,
            searchString: body.searchString,
            searchColumn: body.searchColumn,
            filterBy: body.filterBy,
            filterValues: body.filterValues,
            sortColumn: body.sortColumn,
            sortBy: body.sortBy,
            wcToggle: body.wcToggle,
            pageIndex: body.pageIndex,
            pageSize: body.pageSize,
            isView: body.isView,
        });
    }

    async addChanges(query: DefaultQuery, body: BMPCChangesPayload): Promise<BulkOperationIdResponse> {
        return await this.addChangesUsingOptions({
            operationId: body.operationId,
            changes: body.changes,
            clientId: query.loggedInUserClientId,
        });
    }

    async applyChanges(query: DefaultQuery, body: BulkOperationIdPayload): Promise<BMPCApplyChangesOperationIdResponse> {
        return await this.applyChangesUsingOptions({
            operationId: body.operationId,
            clientId: query.loggedInUserClientId,
            userId: query.userId,
        });
    }

    @LogErrors()
    protected async getFiltersUsingOptions(input: BMPCGetFiltersOptions): Promise<KfFiltersResponse> {
        //GetBulkPCUpdateMetadata
            const operationId = Number(input.operationId);
            if (!operationId || operationId < 1) {
                throw 'No valid operationId provided';
            }

            const isView = Number(input.isView) || 0;

            const metadataDTOs = await this.dataService.getFilters({
                clientId: toNumber(input.clientId),
                userId: toNumber(input.userId),
                locale: toLocale(input.locale, 'en'),
                wcToggle: toBit(input.wcToggle),
                operationId: toNumber(operationId),
                permissions: await this.userService.getPermissions(input.authtoken),
                isView: toBit(isView)
            });
            if (!metadataDTOs?.length) {
                return {};
            }
            return buildFiltersResponse(normalizeFiltersMetaData(metadataDTOs));
    }

    @LogErrors()
    protected async searchProfilesUsingOptions(input: BMPCSearchProfilesOptions): Promise<BMPCSearchProfileResponse> {
        //GetBulkPCProfileDetails
            const operationId = Number(input.operationId);
            if (!operationId || operationId < 1) {
                throw 'No valid operationId provided';
            }

            const isView = Number(input.isView) || 0;

            const options: BMPCSearchProfilesRequestDBOptions = {
                clientId: toNumber(input.clientId),
                userId: toNumber(input.userId),
                searchString: input.searchString,
                searchColumn: input.searchColumn,
                filterBy: input.filterBy,
                filterValues: input.filterValues,
                sortColumn: input.sortColumn,
                sortBy: input.sortBy,
                wcToggle: toBit(input.wcToggle),
                locale: toLocale(input.locale, 'en'),
                pageIndex: Math.max(toNumber(input.pageIndex, 0), 0),
                pageSize: Math.max(toNumber(input.pageSize, 0), 0) || 20,
                permissions: await this.userService.getPermissions(String(input.authtoken)),
                operationId: toNumber(operationId),
                isView: toBit(isView)
            };
            const profileDTOs = await this.dataService.searchProfiles(options);

            const totalResultRecords = profileDTOs.length;
            const pageIndex = options.pageIndex;
            const pageSize = options.pageSize || 1;

            return {
                successProfiles: profileDTOs
                    .slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
                    .map(dto => this.mapProfileDTO(dto)),
                allFilteredIds: profileDTOs.map(dto => this.getProfileDTOId(dto)),
                paging: {
                    pageIndex: pageIndex,
                    pageSize: pageSize,
                    totalPages: Math.ceil(totalResultRecords / pageSize),
                    totalResultRecords: totalResultRecords,
                },
            };
    }

    @LogErrors()
    protected async addChangesUsingOptions(input: BMPCAddChangesOptions): Promise<BulkOperationIdResponse> {
        //ItemModificationBulkEditProfileCollection
            const operationId = Number(input.operationId);
            if (!operationId || operationId < 1) {
                throw 'No valid operationId provided';
            }

            if (!input.changes?.length) {
                throw 'No changes provided';
            }

            const profileCollectionsMap = input.skipVerifyProfileCollections
                ? null
                : mapBy(
                    await this.dataService.getClientProfileCollections(Number(input.clientId)),
                    pc => String(pc.profileCollectionsId)
                );

            const profileCollectionsPerProfiles: Record<any, ProfileCollectionId[]> = {};

            for (const change of input.changes.reverse()) {
                if (!change.successProfileIds) {
                    throw 'No successProfileIds provided for a change';
                }
                if (!Array.isArray(change?.successProfileIds)) {
                    throw 'Invalid successProfileIds provided for a change';
                }
                if (!change.successProfileIds.length) {
                    throw 'No meaningful successProfileIds provided for a change';
                }
                if (!change.profileCollectionIds) {
                    throw 'No profileCollectionIds provided for a change';
                }
                if (!Array.isArray(change.profileCollectionIds)) {
                    throw 'Invalid profileCollectionIds provided for a change';
                }

                const profileCollectionIds = change.profileCollectionIds.map(Number);
                if (profileCollectionIds.some(i => !i)) {
                    throw 'Non-numeric profileCollectionId provided for a change';
                }
                if (profileCollectionsMap && profileCollectionIds.some(i => !profileCollectionsMap[i])) {
                    throw 'Unknown profileCollectionId provided for a change';
                }

                for (const profileId of change.successProfileIds) {
                    const id = Number(profileId);
                    if (!id) {
                        throw 'Non-numeric successProfileId provided for a change';
                    }
                    if (!profileCollectionsPerProfiles[id]) {
                        profileCollectionsPerProfiles[id] = profileCollectionIds;
                    }
                }
            }

            const changeDTOs: BMPCAddChangeDTO[] = [];
            for (const profileId in profileCollectionsPerProfiles) {
                changeDTOs.push({
                    operationId: operationId,
                    successProfileId: Number(profileId),
                    profileCollectionIds: (profileCollectionsPerProfiles[profileId] || []).join(','),
                });
            }

            if (!changeDTOs.length) {
                throw 'Non-meaningful changes provided';
            }

            if (!input.skipRemovePreviousChanges) {
                await this.dataService.removeProfileCollectionAssignmentChanges({
                    operationId: operationId,
                    successProfileIds: changeDTOs.map(i => i.successProfileId),
                });
            }

            await this.dataService.addProfileCollectionAssignmentChanges(changeDTOs);

            return {
                operationId,
            };
    }

    @LogErrors()
    protected async applyChangesUsingOptions(input: BMPCApplyChangesOptions): Promise<BMPCApplyChangesOperationIdResponse> {
        // ItemModificationBulkMapProfileCollection
        // ItemModificationBulkEditProfileCollection
            const operationId = Number(input.operationId);
            if (!operationId || operationId < 1) {
                throw 'No valid operationId provided';
            }

            const mapOperationId = await this.commonDataService.obtainBulkOperationId(
                Number(input.clientId),
                Number(input.userId),
                BulkOperation.profileCollections,
            );

            await this.dataService.copyProfileCollectionAssignmentChanges({
                viewOperationId: operationId,
                mapOperationId
            });

            return {
                mapOperationId,
            };
    }

    protected mapProfileDTO(dto: BMPCGetBulkPCProfileDetailsDTO): BMPCProfileDetails {

        const profileCollectionsName = dto.ProfileCollectionsName || null;
        const profileCollectionsId = dto.ProfileCollectionsId || null;

        let profileCollections: BMPCProfileCollection[] = [];
        if (profileCollectionsName && profileCollectionsId) {
            const names = profileCollectionsName.split('~');
            profileCollections = profileCollectionsId.split('~').map(id => ({
                profileCollectionsId: Number(id),
                profileCollectionsName: names.shift() || '',
            })).filter(o => o.profileCollectionsName && o.profileCollectionsId);
        }

        return {
            id: dto.JobID,
            title: dto.JobTitle,
            familyName: dto.FunctionName,
            subFamilyName: dto.SubFunctionName,
            benchmarkIndicator: anyTo01(dto.BenchmarkIndicator),
            profileCollections,
            totalPoints: (dto.KFHayPoints || 0),
            wcTotalPoints: (dto.KFHayPoints || 0) + (dto.WCPoints || 0),
            grade: buildProfileGradeInfo({
                CustomGrade: dto.CustomGrade,
                Grade: dto.Grade,
                GradeSetID: dto.GradeSetID,
                GradeSetName: dto.GradeSetName,
                MaxGrade: dto.MaxGrade,
                MidPoint: dto.MidPoint,
                MinGrade: dto.MinGrade,
            }),
            countOfProfiles: dto.CountOfProfiles,
            modifiedOn: dto.ModifiedOn,
        };
    }

    protected getProfileDTOId(dto: BMPCGetBulkPCProfileDetailsDTO): number {
        return dto.JobID;
    }
}
