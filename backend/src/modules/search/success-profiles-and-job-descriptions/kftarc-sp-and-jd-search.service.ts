import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../../logger';
import {
    EntityType,
    FilterCategories,
    KfTarcSpAndJdSearchRouteDetails,
    KfTarcSpAndJdSpResponse,
    PreparedFilterValues,
    PreparedFilterValuesMapper,
    PreparedSortsAndFilters,
    ProductId,
    SortByValues,
    SortColumn,
} from './kftarc-sp-and-jd-search.interface';
import { KfTarcSpAndJdSearchRepository } from './kftarc-sp-and-jd-search.repository';

import { toNumber } from '../../../_shared/convert';
import { safeString } from '../../../_shared/safety';
import { HCMIntDownloadProfiles } from '../../custom-sp-export/custom-sp-export.repository';
import { Loggers } from '../../../_shared/log/loggers';

@Injectable()
export class KfTarcSpAndJdSearchService {
        protected logger: LoggerService;
    
    constructor(
        protected kfTarcSpAndJdSearchRepository: KfTarcSpAndJdSearchRepository,
        protected hcmDownloadProfilesRepo: HCMIntDownloadProfiles,
        protected loggers: Loggers,
        
    ) { 
        this.logger = loggers.getLogger(KfTarcSpAndJdSearchService.name);
    }

    async spAndJdSearch(query: KfTarcSpAndJdSearchRouteDetails.QueryParams): Promise<KfTarcSpAndJdSpResponse.Response> {
        try{

        const clientId = toNumber(query.preferredClientId) || toNumber(query.loggedInUserClientId);

        const preparedValues: PreparedSortsAndFilters = this.groupColumnNamesAndTheirValues(query);
        const spsAndJdsDb: KfTarcSpAndJdSpResponse.MappedAndCountedDbResponse = await this.kfTarcSpAndJdSearchRepository.getSpsAndJds({
            clientId: clientId,
            sectionProductId: ProductId[(query.type || '').toString()],
            sortColumns: preparedValues.sortColumns,
            profileCollections: preparedValues.profileCollections ?? null,
            profileCollectionId: toNumber(preparedValues.profileCollectionId),
            roleLevel: toNumber(preparedValues.roleLevel),
            sortOrders: preparedValues.sortOrders,
            searchString: query.searchString || null,
            functions: preparedValues.functions ?? null,
            subFunctions: preparedValues.subFunctions ?? null,
            grades: preparedValues.grades ?? null,
            levels: preparedValues.levels ?? null,
            profileTypes: preparedValues.profileTypes ?? null,
            industries: preparedValues.industries ?? null,
            createdBy: preparedValues.createBy ?? null,
            locale: preparedValues.language || query.locale,
            pageIndex: query.pageIndex,
            pageSize: query.pageSize,
            userId: query.userId,
        });

        const resData = this.contructResponse(spsAndJdsDb.jobs, spsAndJdsDb.totalRecords, query.pageIndex, query.pageSize);

        if (query.type === EntityType.SEARCH_MY_ORG_PROFILES) {
            await this.addExportStatusToSp(resData.jobs, clientId);
        }

        return resData;
    }
    
    catch(e){
        this.logger.error(`Error in ${this.spAndJdSearch.name}: ${e}`);
        throw e;
    }
    }

    private async addExportStatusToSp(successProfiles: KfTarcSpAndJdSpResponse.SpAndJd[], clientId: number): Promise<void> {
        if(!(successProfiles instanceof Array) || !successProfiles.length) return;

        try {
            const spIds = successProfiles.map(sp => sp.id);

            const downloadStatuses = await this.hcmDownloadProfilesRepo.getDownloadedDateForSpId(clientId, spIds);

            const downloadedDates = new Map<string, string>();

            for (const downloadStatus of downloadStatuses) {
                if(!downloadStatus) continue;
                downloadedDates.set(downloadStatus.CustomSPID, downloadStatus.RecentDownloadDate);
            }

            for (const sp of successProfiles) {
                const downloadedDate = downloadedDates.get(String(sp.id));
                sp.exportDetails = {} as KfTarcSpAndJdSpResponse.ExportDetails

                if (downloadedDate) {
                    const downloadTime = new Date(downloadedDate).getTime();
                    const modifyTime = sp.source.find(s => s.type == KfTarcSpAndJdSpResponse.SourceType.LAST_MODIFIED_BY)?.effectiveDateTime || 0;                    

                    if (downloadTime < modifyTime) {
                        sp.exportDetails.exportStatus = KfTarcSpAndJdSpResponse.SPExportStatus.DOWNLOADED_MODIFIED;
                    } else {
                        sp.exportDetails.exportStatus = KfTarcSpAndJdSpResponse.SPExportStatus.DOWNLOADED;
                    }

                    sp.exportDetails.exportDate = downloadTime;

                } else {
                    sp.exportDetails.exportStatus = KfTarcSpAndJdSpResponse.SPExportStatus.NOT_DOWNLOADED;
                    sp.exportDetails.exportDate = null;
                }
            }
        } catch (e) {
            this.logger.error(`Error adding download status to response: ${e}`);
            throw e;
        }
    }

    contructResponse(
        spsAndJds: KfTarcSpAndJdSpResponse.SpAndJd[],
        totalRecords: number,
        pageIndex: number,
        pageSize: number,
    ): KfTarcSpAndJdSpResponse.Response {
        return {
            jobs: spsAndJds,
            paging: {
                pageIndex: pageIndex,
                pageSize: pageSize,
                totalPages: Math.ceil(totalRecords / pageSize),
                totalResultRecords: totalRecords,
            },
        };
    }

    parseStringCoalescedByDelimeter(pipedString: string, delimeter: string): string[] {
        return pipedString.split(delimeter);
    }

    findInvalidPipedValues<T>(values: string[], allowedValuesSet: T): boolean {
        const invalidValues = values.filter(value => !Object.values(allowedValuesSet).includes(value));
        return !!invalidValues.length;
    }

    checkCoalescedString<T>(pipedString: string, delimeter: string, allowedValuesSet: T): string[] & unknown {
        const parsedValues = this.parseStringCoalescedByDelimeter(pipedString, delimeter);
        if (this.findInvalidPipedValues(parsedValues, allowedValuesSet)) {
            throw new Error(safeString(`Invalid value caught in the piped string: ${pipedString}`));
        }
        return parsedValues;
    }

    groupColumnNamesAndTheirValues(query: KfTarcSpAndJdSearchRouteDetails.QueryParams): PreparedSortsAndFilters {
        const dividedSortColumns: string[] = this.checkCoalescedString(query.sortColumn, '|', SortColumn);
        const dividedSortOrders: string[] = this.checkCoalescedString(query.sortBy, '|', SortByValues);
        const dividedFilterCategories: string[] = this.checkCoalescedString(query.filterBy, '|', FilterCategories);
        const groupedFilterValues: string[] = this.parseStringCoalescedByDelimeter(query.filterValues, '|');

        return {
            ...this.prepareSortColumnsAndOrdersForStoredProc(dividedSortColumns, dividedSortOrders),
            ...this.prepareFilterCategoriesAndValuesForStoredProc(dividedFilterCategories, groupedFilterValues),
        };
    }

    prepareSortColumnsAndOrdersForStoredProc(dividedSortColumns: string[], dividedSortOrders: string[]): { sortColumns: string; sortOrders: string } {
        let sortColumnsPrepared: string = ''; //in_sortcolumn
        let sortOrdersPrepared: string = ''; //in_sortby

        for (let i = 0; i < dividedSortColumns.length; i++) {
            sortColumnsPrepared += dividedSortColumns[i].toString();
            sortOrdersPrepared += dividedSortOrders[i].toLocaleUpperCase();
            if (i !== dividedSortColumns.length - 1) {
                sortColumnsPrepared += ',';
                sortOrdersPrepared += ',';
            }
        }
        return {
            sortColumns: sortColumnsPrepared,
            sortOrders: sortOrdersPrepared,
        };
    }

    prepareFilterCategoriesAndValuesForStoredProc(dividedFilterCategoriesValues: string[], groupedFilterValues: string[]): PreparedFilterValues {
        let preparedValues: PreparedFilterValues = {};
        preparedValues = dividedFilterCategoriesValues.reduce((acc, category, index) => {
            if (category !== FilterCategories.GRADES) {
                groupedFilterValues[index] = groupedFilterValues[index].replace(/;/g, ',');
            }
            acc[PreparedFilterValuesMapper[category]] = groupedFilterValues[index];
            return acc;
        }, {});
        return preparedValues;
    }
}
