import { AppCode as ec } from '../../app.const';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger';
import { KfTarcRolesInterface as Kf } from './kftarc-roles.interface';
import { KfRolesUtil } from './kftarc-roles.utils';
import { RequestCommon } from '../../common/common.utils';
import { Request } from 'express';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { MapErrors } from '../../_shared/error/map-errors.decorator';
import { Loggers } from '../../_shared/log/loggers';
import { HttpsService } from '../../_shared/https/https.service';
import { ConfigService } from '../../_shared/config/config.service';
import { toLocale, toNumber, toStringOr } from '../../_shared/convert';
import { TypeOrmHelper } from '../../_shared/db/typeorm.helper';

@Injectable()
export class KfTarcRolesService extends RequestCommon {
    protected logger: LoggerService;

    constructor(
        protected sql: TypeOrmHelper,
        protected https: HttpsService,
        protected loggers: Loggers,
        protected configService: ConfigService,
    ) {
        super(configService);
        this.logger = loggers.getLogger(KfTarcRolesService.name);
    }

    protected rolesUtil = new KfRolesUtil();

    @MapErrors({ errorCode: ec.EXTERNAL_CALL_ERR })
    @LogErrors()
    async getPermissions(request: Request): Promise<Kf.SuccessProfilesPermissions> {
            const authToken = request.headers.authtoken as string;
            const psSessionId = request.headers['ps-session-id'];
            const url = this.getPermissionsUrl();
            const headers = this.getKfhubApiHeaders(authToken, psSessionId);

            const permissions = await this.https.get(url, headers);
            return permissions as Kf.SuccessProfilesPermissions;
    }

    @LogErrors()
    getFilterValues(query: Kf.RolesQueryParams): Kf.FilterValues {
            const { PIPE, COLON, COMMA } = Kf.Delimiter;
            const { filterBy = '', filterValues = '' } = query;

            const filterByData = filterBy.split(PIPE);
            const filterValueData = filterValues.split(PIPE);

            if (filterByData.length !== filterValueData.length) {
                throw `inconsistency in filter values mapped to filter by`;
            }

            const gradeIndex = filterByData.findIndex(o => o === Kf.FilterType.GRADES);
            const subFunctionIndex = filterByData.findIndex(o => o === Kf.FilterType.SUBFUNCTIONS);
            const profileIndex = filterByData.findIndex(o => o === Kf.FilterType.PROFILES);
            const roleTypeIndex = filterByData.findIndex(o => o === Kf.FilterType.ROLE_TYPE);
            const valueStreamIndex = filterByData.findIndex(o => o === Kf.FilterType.VALUE_STREAM);
            const pcIndex = filterByData.findIndex(o => o === Kf.FilterType.PROFILE_COLLECTIONS);

            const grades = gradeIndex !== -1 ? filterValueData[gradeIndex].split(COLON).filter(grade => grade !== '') : '';
            const profiles = profileIndex !== -1 ? filterValueData[profileIndex].split(COLON).filter(profile => profile !== '') : '';
            const roleTypes = roleTypeIndex !== -1 ? filterValueData[roleTypeIndex].split(COLON).filter(roleType => roleType !== '') : '';
            const valueStreams = valueStreamIndex !== -1 ? filterValueData[valueStreamIndex].split(COLON).filter(stream => stream !== '') : '';
            const profileCollections = pcIndex !== -1 ? filterValueData[pcIndex].split(COLON).filter(profile => profile !== '') : '';

            const subFunctionsArr = subFunctionIndex !== -1 ? filterValueData[subFunctionIndex].split(COLON) : [];
            const subFunctions = subFunctionsArr.map((sf: string) => `''${sf}'' `).join(COMMA);

            return {
                grades: `${grades}`,
                profiles: `${profiles}`,
                subFunctions: `${subFunctions}`,
                roleTypes: `${roleTypes}`,
                valueStreams: `${valueStreams}`,
                profileCollections: `${profileCollections}`,
            };
    }

    @LogErrors()
    getFiltersDataWithoutLevel(query: Kf.RolesQueryParams): Kf.FilterByWithoutLevels {
        let levelsFilter = '';
        let filterByWithoutLevel = '';
        let filterValuesWithoutLevel = '';

        if (query.filterBy) {

            const filterByArr = query.filterBy.replace(/'/gi, '').split('|');
            const filterValuesArr = query.filterValues.replace(/'/gi, '').split('|');

            if (filterByArr.includes('LEVELS')) {
                const levelsFilterIndex = filterByArr.indexOf('LEVELS');
                levelsFilter = filterValuesArr[levelsFilterIndex].split(';').join(',');
                filterByArr.splice(levelsFilterIndex, 1);
                filterValuesArr.splice(levelsFilterIndex, 1);
                filterByWithoutLevel = (filterByArr.length > 0) ?  filterByArr.join('|')  : null;
                filterValuesWithoutLevel = (filterValuesArr.length > 0) ?  filterValuesArr.join('|'): null;
            }
        }

        return {
            filterByWithoutLevel: filterByWithoutLevel || null,
            filterValuesWithoutLevel: filterValuesWithoutLevel || null,
            levelFilter: levelsFilter || null
        };
    }

    @LogErrors()
    async getRoles(queryParams: Kf.RolesQueryParams, request: Request): Promise<Kf.RolesList> {

        const restrictions = this.checkUAMPointsRestrictions(await this.getPermissions(request))
        const pageIndex = toNumber(queryParams.pageIndex, 0) || Kf.Defaults.pageIndex;
        const pageSize = toNumber(queryParams.pageSize, 0) || Kf.Defaults.pageSize;

        const filters: Partial<Kf.FilterValues & Kf.FilterByWithoutLevels> = queryParams.filterBy ? {
            ...this.getFilterValues(queryParams),
            ...this.getFiltersDataWithoutLevel(queryParams)
        } : {};

        const data: Kf.databaseDTO[] = await this.sql.query(`
                exec SuccessProfile.dbo.GetKFArchitectAddJobSearchProfiles
                    :clientId,
                    :locale,
                    :pageIndex,
                    :pageSize,
                    :profiles,
                    :subFunctions,
                    :grades,
                    :sortColumn,
                    :searchString,
                    :sortBy,
                    :isExec,
                    :pointValue,
                    :userId,
                    :boxProfile,
                    :valueStreams,
                    :roleTypes,
                    :levelFilter,
                    :profileCollections
            `,
            {
                pageIndex,
                pageSize,
                clientId: toNumber(queryParams.loggedInUserClientId),
                userId: toNumber(queryParams.userId),
                locale: toLocale(queryParams.locale, Kf.Defaults.locale),
                sortColumn: toStringOr(queryParams.sortColumn) || Kf.Sort.NAME,
                sortBy: toStringOr(queryParams.sortBy) || Kf.Sort.ASC,
                searchString: toStringOr(queryParams.searchString) || null,
                boxProfile: toNumber(queryParams.boxProfile, 0),
                isExec: toNumber(restrictions.isExec),
                pointValue: toNumber(restrictions.pointValue) || null,
                grades: toStringOr(filters.grades) || '',
                subFunctions: toStringOr(filters.subFunctions) || '',
                profiles: toStringOr(filters.profiles) || '',
                roleTypes: toStringOr(filters.roleTypes) || '',
                valueStreams: toStringOr(filters.valueStreams) || '',
                levelFilter: toStringOr(filters.levelFilter) || null,
                profileCollections: toStringOr(filters.profileCollections) || ''
            }
        );

        let rolesList: any = [];
        let totalResultRecords = 0;
        let totalShowRecords = 0;
        let totalPages = 0;

        if (data.length) {
            rolesList = this.rolesUtil.groupProfilesUnderRoles(data);
            totalResultRecords = toNumber(data[0].TotalResultRecords);
            totalShowRecords = toNumber(data[0].TotalShowRecords);
            totalPages = Number(Math.ceil(totalShowRecords / pageSize));
        }

        return {
            roles: rolesList,
            paging: {
                pageIndex,
                pageSize,
                totalPages,
                totalShowRecords,
                totalResultRecords,
            },
        };
    }
}

/*
Results from DB for applied filters

 -TotalResultRecords indicates the count of (Total success profiles)
 -TotalShowRecords   indicates the count of (Top-level Hierachy)(Total roles+cxo-profiles+custom-profiles)
 -TotalRoleNumber    indicates the count of (roles)

 Calculations for Pagination

 - totalPages         = TotalShowRecords/pageSize
 - totalResultRecords = TotalResultRecords (Total success profiles)
 - totalShowRecords   = TotalShowRecords

 SearchAPIRolesAndProfiles to GetKFArchitectAddJobSearchProfiles
 */
