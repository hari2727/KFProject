import _ from 'lodash';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment, KfAuthService, KfStorageService } from '@kf-products-core/kfhub_lib';
import {
    KfISpMatrixData, KfISpMatrixLoaderService, KfThclSPSharedService,
    KfThclTalentArchitectConstantsService, fileReportType, KFIFileAction
} from '@kf-products-core/kfhub_thcl_lib';
import { getFilterEncodedQuery, SortableColumn, SpTypeEnum } from '@kf-products-core/kfhub_thcl_lib/domain';
import { TranslateService } from '@ngx-translate/core';

import { SortColumn, SpSearchFilterEnum } from '../../../pages/sp-search/sp-search.constant';

@Injectable()
export class KfTarcSpMatrixService implements KfISpMatrixLoaderService {
    private readonly pageSize = 5;

    constructor(
        private authService: KfAuthService,
        private talentArchitectConstants: KfThclTalentArchitectConstantsService,
        private translate: TranslateService,
        private http: HttpClient,
        private storageService: KfStorageService,
        private spSharedService: KfThclSPSharedService,
    ) { }

    loadContent(filters: { type: string; label: string; value: string }[], pageId: number): Observable<KfISpMatrixData> {
        const baseUrl = `${this.talentArchitectConstants.getSuccessprofilesBaseUrl()}/matrix/?type=CAREER_ARCHITECTURE_VIEW`;

        const sorting = [{ id: 'date', sortBy: 'desc', sortColumn: SortColumn.ModifiedOn, title: 'lib.date' }] as SortableColumn<string>[];
        const matrixAppliedFilters =
            filters.filter(f => [
                SpSearchFilterEnum.ProfileCollections,
                SpSearchFilterEnum.SearchSource,
                SpSearchFilterEnum.Functions,
                SpSearchFilterEnum.SubFunctions,
                SpSearchFilterEnum.ProfileType].some(filter => f.type === filter));
        const encodedQuery = getFilterEncodedQuery(SortColumn.JobTitle, '', sorting, matrixAppliedFilters, pageId || 1, this.pageSize);

        const url = `${baseUrl}&${encodedQuery}`;
        return forkJoin([
            this.authService.authHttpCallv2('GET', url, null),
            this.getNames(),
        ]).pipe(map(([data, names]) => this.convertToMatrixFormat(data, names)));
    }

    exportMatrix(filters: { type: SpSearchFilterEnum; label: string; value: string }[], showShortProfile, companyName, callBulkRunner?: boolean) {
        const url = this.getExportUrl();
        const searchQuery = '/?type=CAREER_ARCHITECTURE_VIEW_EXPORT';
        const authToken = this.authService.AuthToken;
        const headers = new HttpHeaders({
            authToken,
            'ps-session-id': this.storageService.getItem('ps-session-id'),
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const sourceAndFuncFilters =
            filters.filter(f => [
                SpSearchFilterEnum.ProfileCollections,
                SpSearchFilterEnum.ProfileType,
                SpSearchFilterEnum.SearchSource,
                SpSearchFilterEnum.Functions,
                SpSearchFilterEnum.SubFunctions].some(filter => f.type === filter));
        const encodedQuery = getFilterEncodedQuery(SortColumn.JobTitle, '', [], sourceAndFuncFilters, null, null);

        const exportUrl = `${searchQuery}&${encodedQuery}`;
        const data = {
            exportUrl,
            showShortProfile,
            companyName,
        };
        if (callBulkRunner) {
            this.spSharedService.downloadMassiveReport('SP_MATRIX', {
                exportUrl,
                payload: {
                    showShortProfile,
                    companyName,
                },
            });
        } else {
            // SP-13882 This code will not be used because bulk runner is used as a default export option
            this.http.post(url, data, { headers, responseType: 'blob' }).subscribe((response) => {
                const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const pdfUrl = window.URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.setAttribute('download', 'export.xlsx');
                link.href = pdfUrl;
                link.click();

                window.URL.revokeObjectURL(pdfUrl);
                this.spSharedService.callAuditLog('xlsx', fileReportType.PM_JOB_MATRIX_VIEW, true, KFIFileAction.DOWNLOAD);
            }, (err) => this.spSharedService.callAuditLog('xlsx', fileReportType.PM_JOB_MATRIX_VIEW, false, KFIFileAction.DOWNLOAD));
        }
    }

    private getExportUrl() {
        const env = environment();
        return env['tarc.matrixExportUrl'];
    }

    private getNames() {
        return forkJoin([
            this.translate.get('lib.SUBFUNCTIONS'),
            this.translate.get('lib.Roles'),
            this.translate.get('lib.successProfiles'),
        ]);
    }

    private convertToMatrixFormat(data: any, names: string[]): KfISpMatrixData {
        if (_.isEmpty(data)) {
            return { sections: [] };
        }
        const sections = _.map(data.jobFamilies, (family) => {
            const descriptions = this.makeDescriptions(family.insights, names);
            const subsections = _.map(family.jobSubFamilies, (subfamily) => {
                const items = this.getItems(subfamily.jobRoles, subfamily.id);
                return {
                    items,
                    name: subfamily.name,
                    id: subfamily.id,
                };
            });
            return {
                descriptions,
                subsections,
                name: family.name,
                id: family.id,
            };
        });
        const nextPageId = data.paging.pageIndex < data.paging.totalPages ? data.paging.pageIndex + 1 : null;
        const matrixData = { nextPageId, sections };
        return matrixData as KfISpMatrixData;
    }

    private makeDescriptions(insights, names: string[]) {
        return [
            `${names[0]}: ${insights.totalSubFamilies}`,
            `${names[1]}: ${insights.totalJobRoles}`,
            `${names[2]}: ${insights.totalSuccessProfiles}`,
        ];
    }

    private getItems(jobRoles, parentId) {
        const items = _.flatMap(jobRoles, (role) => {
            const standardItem = this.getStandardItem(role, parentId);
            const customItems = this.getCustomItems(role.jobs);
            if (standardItem) {
                return [standardItem, ...customItems];
            }
            return customItems;
        });
        return items;
    }

    private getLevel(level: any[]) {
        if (_.isEmpty(level)) {
            return null;
        }
        if (_.size(level) === 1) {
            const wrapper: any = _.head(level);
            return wrapper.value;
        }
        const min: any = _.head(level);
        const max: any = _.last(level);
        return `${min.value}-${max.value}`;
    }

    private getStandardItem(role, parentId) {
        if (!_.isEmpty(role.grades)) {
            const data = role.isExecutive
                ? this.getBICExecData(role)
                : this.getRangeData(role);
            const item = {
                ...data,
                itemsDetailedCount: role.totalSuccessProfiles,
                popupData: {
                    ...data,
                    parentId,
                    level: this.getLevel(role.level),
                    subLevel: this.getLevel(role.subLevel),
                    shortProfile: this.getShortProfile(role.shortProfile),
                    isCustom: false,
                    isExecutive: role.isExecutive,
                    isExecutiveUngraded: this.isExecutiveUngraded(role),
                },
            };
            return item;
        }
    }

    private getRangeData(role) {
        const minVal: any = _.minBy(role.grades, 'value');
        const maxVal: any = _.maxBy(role.grades, 'value');
        return {
            minValue: parseInt(minVal.value, 10),
            maxValue: parseInt(maxVal.value, 10),
            type: 'range' as const,
            subType: role.profileType === SpTypeEnum.ONet ? 'jobProfile' : 'successProfile' as const,
            id: role.jobRoleTypeId,
            name: role.name,
            profileType: role.profileType,
        };
    }

    private getBICExecData(role) {
        const { min, max, value } = _.first(role.grades) as any;
        return {
            minValue: parseInt(min, 10),
            maxValue: parseInt(max, 10),
            standardHayGrade: parseInt(value, 10),
            type: 'range' as const,
            subType: 'successProfile' as const,
            id: role.jobRoleTypeId,
            jobId: role.jobId,
            name: role.name,
            profileType: role.profileType,
        };
    }

    private getCustomItems(jobs) {
        return _.map(jobs, (job) => {
            const data = this.getCustomData(job);
            return {
                ...data,
                popupData: {
                    ...data,
                    level: job.levelName,
                    isExecutive: job.isExecutive,
                    isGraded: !(job.min && job.max),
                    subLevel: job.subLevelName,
                    shortProfile: this.getShortProfile(job.shortProfile),
                    isCustom: true,
                    isExecutiveUngraded: this.isExecutiveUngraded(job),
                },
            };
        });
    }

    private getCustomData(job) {
        if (job.isExecutive && job.min && job.max) {
            return {
                type: 'range' as const,
                subType: 'successProfileExecCustom' as const,
                id: job.id,
                name: job.name,
                minValue: parseInt(job.min, 10),
                maxValue: parseInt(job.max, 10),
            };
        }
        const { minCustomValue, maxCustomValue } = this.getCustomGradeRange(job);
        return {
            minCustomValue,
            maxCustomValue,
            type: 'point' as const,
            subType: 'successProfile' as const,
            id: job.id,
            name: job.name,
            value: parseInt(job.standardHayGrade, 10),
            profileType: job.profileType,
        };
    }

    private getShortProfile(shortProfile: any[]) {
        if (_.isEmpty(shortProfile)) {
            return null;
        }
        if (_.isString(shortProfile)) {
            return shortProfile;
        }
        if (_.size(shortProfile) === 1) {
            const wrapper: any = _.head(shortProfile);
            return wrapper.value;
        }
        const min: any = _.head(shortProfile);
        const max: any = _.last(shortProfile);
        return `${min.value}-${max.value}`;
    }

    private getCustomGradeRange(item) {
        const grades = _.get(item, 'customGrades.grades', []);
        const minCustomValue = _.get(_.first(grades), 'gradeLabel');
        const maxCustomValue = _.get(_.last(grades), 'gradeLabel');
        return { minCustomValue, maxCustomValue };
    }

    public isExecutiveUngraded(job): boolean {
        return job.isExecutive === true && job.min !== undefined && job.max !== undefined;
    }
}
