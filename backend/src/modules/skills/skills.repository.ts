import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger';
import { DataSource } from 'typeorm';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { escapeAndRunQueryWithParams } from '../../_shared/db/typeorm';
import { toNumber, toLocale } from '../../_shared/convert';
import {
    SkillsSearchFilterQuery,
    NewSearchDependantDBResponse,
    GetResponsibilityModelQuery,
    DEFAULT_FILTER_PARAMS
} from './skills.interface';
import { Loggers } from '../../_shared/log/loggers';

@Injectable()
export class SkillsRepository {
    protected logger: LoggerService;

    constructor(
        protected dataSource: DataSource,
        private readonly loggers: Loggers,
    ) {
        this.logger = this.loggers.getLogger(SkillsRepository.name);
    }

    @LogErrors()
    async searchDependents(
        id: number,
        preferredLocale: string,
        preferredClientId: number
    ): Promise<NewSearchDependantDBResponse[]> {
        return await escapeAndRunQueryWithParams(this.dataSource, `
            use CMM;
            Declare @JobSubCategoryID bigint, @LCID nvarchar(20), @ClientID BigInt, @ModelID Int
            set @JobSubCategoryID=:JobSubCategoryID;
            Set @LCID =:LCID;
            Set @ClientID =:ClientID;
            Select @ModelID =  JobDescriptionModelID from SuccessProfile.dbo.ClientStandardModelMapping where ClientID = @ClientID and IsActive = 1
            Select * 
            From (
                Select *,
                    DENSE_Rank() Over (partition by JobSubcategoryId Order by CoresupportFlag Desc,JobSubCategoryDependantName ) RNK 
                    From (
                            Select JSC.JobSubCategoryID,
                                JSCD.JobSubCategoryDependantID,
                                COALESCE(JSCDT.JobSubCategoryDependantName, JSCD.JobSubCategoryDependantName) JobSubCategoryDependantName,
                                CASE WHEN JSCD.CoreSupportFlag = 0 then 'false' ELSE 'true' END AS CoreSupportFlag,
                                COUNT(1) OVER () as TotalSkills,
                                SUM(Case when JSCD.CoreSupportFlag = 1 then 1 else 0 end) OVER () CoreCount,
                                SUM(Case when JSCD.CoreSupportFlag = 0 then 1 else 0 end) OVER () NonCoreCount
                        From successprofile.dbo.JobSubCategoryDependant JSCD
                        Inner Join successprofile.dbo.JobSubCategory Std On std.JobSubCategoryID = JSCD.JobSubCategoryID and JSCD.JobDescriptionModelID = @ModelID and JSCD.ClientJobID is null
                        Inner Join JobSubCategory JSC On Std.JobSubCategoryCde = JSC.JobSubCategoryCde AND JSC.JobSubCategoryID = @JobSubCategoryID
                        Left join successprofile.dbo.JobSubCategoryDependantTranslation JSCDT on (JSCD.JobSubCategoryDependantID = JSCDT.JobSubCategoryDependantID AND JSCDT.LCID= @LCID)
                    ) AS  A 
                ) AS A 
                Where RNK<=40
                ORDER BY JobSubCategoryID, JobSubCategoryDependantName ASC`,
            {
                JobSubCategoryID: id,
                LCID: preferredLocale,
                ClientID: preferredClientId,
            }
        );
    }

    @LogErrors()
    async searchSkills(queryParams: SkillsSearchFilterQuery): Promise<any[]> {
        this.logger.log(JSON.stringify(queryParams));
        const {
            preferredLocale,
            searchString,
            sortColumn = DEFAULT_FILTER_PARAMS.sortColumn,
            sortBy = DEFAULT_FILTER_PARAMS.sortBy,
            filterValues,
            pageIndex = DEFAULT_FILTER_PARAMS.pageIndex,
            pageSize = DEFAULT_FILTER_PARAMS.pageSize,
            locale,
            loggedInUserClientId
        } = queryParams;

        // Handle filters
        const filters = filterValues ? filterValues.split('|').map(Number) : [];
        const filterValuesParam = filters.length ? filters.join(',') : null;

        // Map sort columns
        const sortByColumnMap: Record<string, string> = {
            TECHNICAL_SKILLS: 'JobSubCategoryDependantName',
            TECHNICAL_COMPETENCIES: 'JobSubCategoryName',
        };
        const dbSortColumn = sortByColumnMap[sortColumn];

        // Escape search string
        const escapedSearchText = searchString ? searchString.replace(/[%_]/g, '\\$&') : '';

        return await escapeAndRunQueryWithParams(this.dataSource, `
            exec CMM.dbo.SpSelTechnicalSkills
                @ClientID = :clientId,
                @LCID = :locale,
                @in_filterValues = :filterValues,
                @in_searchString = :searchText,
                @InsortColumn = :sortColumn,
                @InsortBy = :sortBy,
                @InPageSize = :pageSize,
                @InPageNo = :pageIndex
            `,
            {
                clientId: toNumber(loggedInUserClientId),
                locale: toLocale(preferredLocale ?? locale),
                filterValues: filterValuesParam,
                searchText: escapedSearchText,
                sortColumn: dbSortColumn,
                sortBy: sortBy,
                pageSize: toNumber(pageSize),
                pageIndex: toNumber(pageIndex)
            }
        );
    }

    async getResponsibilityModelDetailId(query: GetResponsibilityModelQuery, id: number): Promise<any[]> {
        return await escapeAndRunQueryWithParams(this.dataSource, `
            exec CMM.dbo.GetResponsibilityModelDetailId
                @In_ID = :id,
                @In_LCID = :locale,
                @In_ClientID = :clientId
            `,
            {
                id: toNumber(id),
                locale: toLocale(query.preferredLocale),
                clientId: toNumber(query.preferredClientId)
            }
        );
    }
} 