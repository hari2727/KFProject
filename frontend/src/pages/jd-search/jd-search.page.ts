/* eslint-disable max-classes-per-file */

import * as _ from 'lodash';
import { forkJoin as observableForkJoin } from 'rxjs';

import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
    KfAuthService, KfISearchResultsColumnMetadata, callBulkRunner
} from '@kf-products-core/kfhub_lib';
import {
    KfUser
} from '@kf-products-core/kfhub_lib/auth';
import {
    KfThclSpCompareBucketService, KfThclSPSharedService,
    KfThclSuccessprofileService as SuccessprofileService,
    fileReportType,
} from '@kf-products-core/kfhub_thcl_lib';
import {
    renderCreatedBy, renderModifiedDate, SourceTypeEnum, KfSortDirection, localizeDate
} from '@kf-products-core/kfhub_thcl_lib/domain';
import { Dropdown } from '@kf-products-core/kfhub_thcl_lib/presentation';
import { TranslateService } from '@ngx-translate/core';

import {
    KfTarcJobDescriptionService as JobDescriptionsService
} from '../../app/modules/services/kftarc-job-description.service';
import { HttpService } from '../../app/services/http.service';
import { jdColumnSource, jdColumns, JdSearchFilterEnum, menuTerms, SortColumn } from './jd-search.constant';
import {
    JdSearch, JdSearchColumns, JdSearchRow, JdSearchSortableColumn, JdMenuCell, MenuItem
} from './jd-search.model';
import { canCopy } from './jd-search.pure';
import {
    KfISuccessProfileDownloadOptions
} from '@kf-products-core/kfhub_thcl_lib/_deprecated/models/kfthcl-i-download-options.model';
import { DEFAULT_PAGE_SIZE } from '../sp-search/sp-search.constant';

@Component({
    selector: 'kftarc-jd-search-page',
    templateUrl: './jd-search.page.html',
    styleUrls: ['./jd-search.page.scss'],
})
export class JdSearchPage implements OnInit {

    public searchString: string;
    public columnsMetadata: KfISearchResultsColumnMetadata[];

    public showRemoveModal = false;
    public isAboutCompanyOpen = false;
    public applyToAllJobDescriptions = false;
    public showConfirmAboutModal = false;
    public showDiscardAllModal = false;
    // Shoud be removed when about the company is received from the API
    public initCompAbout = '';
    // Should be removed when permission is received from the API
    public editAboutTheCompanyPermission = false;
    private permissionsCache: { [key: number]: any } = {};

    columns: string[];
    columnSource: JdSearchColumns;
    dataSource: JdSearchRow[] = [];
    menuItems: MenuItem[] = [];
    menuLabels: string[];
    totalRows: number;
    infiniteScrollDisabled = true;
    selectedFilters: { type: JdSearchFilterEnum; label: string; value: string }[];
    fg: UntypedFormGroup;
    jobDescriptionId: number;
    jobDescriptionTitle: string;

    private get locale(): string {
        const user = this.user;
        return user && user.Locale || 'en';
    }

    private get user(): KfUser {
        return this.authService.getSessionInfo().User;
    }

    private get companyId(): number {
        const sessionInfo = this.authService.getSessionInfo();
        return sessionInfo.Client.ClientId;
    }

    public applicationTypeEnum = {
        PM: 'PM',
        JD: 'JD',
    };

    constructor(
        private datePipe: DatePipe,
        private router: Router,
        private spService: SuccessprofileService,
        private jobDescriptionService: JobDescriptionsService,
        private spSharedService: KfThclSPSharedService,
        private authService: KfAuthService,
        private translate: TranslateService,
        private bucketService: KfThclSpCompareBucketService,
        private httpService: HttpService,
    ) { }

    ngOnInit() {
        this.fg = new UntypedFormGroup({
            about: new UntypedFormControl(),
            applyToAllJobDescriptions: new UntypedFormControl(),
        });

        const access = this.authService.getSessionInfo().User.Permissions;
        this.editAboutTheCompanyPermission = access && access.hasEditUniversalCompanyTextAccess;


        this.columns = _.clone(jdColumns);
        this.columnSource = _.cloneDeep(jdColumnSource);

        observableForkJoin(_.map(menuTerms, term => this.translate.get(term))).toPromise().then((menuLabels) => {
            this.menuLabels = menuLabels;
        });
    }

    public removeJd(id: number, title: string): void {
        this.jobDescriptionId = id;
        this.jobDescriptionTitle = title;
        this.showRemoveModal = true;
    }

    async removeJdChoice(choice: boolean) {
        this.showRemoveModal = false;
        if (choice) {
            await this.authService.removeJobDescription(this.jobDescriptionId).toPromise();

            this.dataSource = _.filter(this.dataSource, s => s.id !== this.jobDescriptionId);
            this.totalRows -= 1;
        }

        this.jobDescriptionId = undefined;
        this.jobDescriptionTitle = undefined;
    }

    public async editAboutTheCompany() {
        const desc = await this.httpService.getUniversalCompanyDesc(this.companyId).toPromise();
        this.initCompAbout = desc.companyDetails.aboutTheCompany || '';

        this.fg.patchValue({ about: desc.companyDetails.aboutTheCompany, applyToAllJobDescriptions: desc.applyToAllJobDescriptions });

        this.isAboutCompanyOpen = true;
    }

    public closeEditAboutTheCompany(): void {
        if (this.fg.value.about !== this.initCompAbout) {
            this.showDiscardAllModal = true;
        } else {
            this.isAboutCompanyOpen = false;
        }
    }

    public canDeactivate(): boolean {
        this.closeEditAboutTheCompany();
        return !this.isAboutCompanyOpen;
    }

    public async saveAboutTheCompany() {
        const applyToAllJobDescriptions = this.fg.controls.applyToAllJobDescriptions.value;

        if (applyToAllJobDescriptions) {
            this.showConfirmAboutModal = true;
        } else {
            const data = {
                companyDetails: { id: this.companyId, aboutTheCompany: this.fg.controls.about.value },
                applyToAllJobDescriptions
            };
            await this.httpService.updateUniversalCompanyDesc(data).toPromise();

            this.isAboutCompanyOpen = false;
        }
    }

    public async leaveConfirmAbout(event: boolean) {
        if (event) {
            this.showConfirmAboutModal = false;
            this.isAboutCompanyOpen = false;

            const applyToAllJobDescriptions = this.fg.controls.applyToAllJobDescriptions.value;
            const data = {
                companyDetails: { id: this.companyId, aboutTheCompany: this.fg.controls.about.value },
                applyToAllJobDescriptions
            };
            await this.httpService.updateUniversalCompanyDesc(data).toPromise();
        } else {
            this.showConfirmAboutModal = event;
        }
    }

    public discardAllChanges(status: boolean): void {
        if (status) {
            this.showDiscardAllModal = false;
            this.isAboutCompanyOpen = false;
            this.fg.reset({ about: '' });
        } else {
            this.showDiscardAllModal = false;
        }
    }

    sorting: JdSearchSortableColumn[] = [];
    pageIndex = 1;
    pageSize = DEFAULT_PAGE_SIZE;
    totalPages = 1;

    async onFilterChange(meta: { search: string; filters: { type: JdSearchFilterEnum; label: string; value: string }[] }) {
        this.searchString = meta.search;
        this.selectedFilters = meta.filters;
        this.infiniteScrollDisabled = false;
        this.totalRows = 0;
        this.pageIndex = 1;
        this.search(meta, this.pageIndex, false);
    }

    async scrollDown(event: { pageIndex: number }) {
        this.search({ filters: this.selectedFilters, search: this.searchString }, event.pageIndex);
    }

    private async search(meta: { search: string; filters: { type: JdSearchFilterEnum; label: string; value: string }[] }, pageIndex: number, savePrev = true) {
        this.infiniteScrollDisabled = true;

        const res = await this.httpService.jdSearchFilter(
            SortColumn.JobTitle, meta.search, pageIndex, this.pageSize, this.sorting, meta.filters
        ).toPromise();

        if (!res) {
            this.dataSource = [];
            return;
        }

        const { jobs, paging } = res;

        const dataSource = this.computeDataSource(jobs, this.locale);

        this.dataSource = savePrev ? _.concat(this.dataSource, dataSource) : dataSource;
        this.pageIndex = +paging.pageIndex;
        this.totalPages = paging.totalPages;
        this.totalRows = paging.totalResultRecords;

        this.infiniteScrollDisabled = this.totalRows === this.dataSource.length;
    }

    sortByColumn(event: { id: string; direction: KfSortDirection }[]) {
        const pageIndex = 1;
        this.sorting = event.map(s => ({
            id: s.id,
            sortBy: s.direction,
            title: this.columnSource[s.id].title,
            sortColumn: this.columnSource[s.id].sortColumn,
        }));

        if (_.isEmpty(event)) {
            return false;
        }

        this.search({ filters: this.selectedFilters, search: this.searchString }, pageIndex, false);
    }


    computeDataSource(jds: JdSearch[], locale: string): JdSearchRow[] {

        return _.map(jds, jd => {
            const source = _.map(jd.source, s => ({ id: s.id, type: s.type }));
            return {
                id: jd.id,
                name: { text: jd.title, href: this.getTitleHref(jd.id, source) },
                level: 'level' in jd ? jd.level as string : jd.levelName,
                function: 'jobFamilyName' in jd ? jd.jobFamilyName as string : jd.familyName,
                createdBy: renderCreatedBy(jd.source),
                date: renderModifiedDate(jd.source, locale),
                menu: {
                    id: jd.id,
                    title: jd.title,
                    source,
                }
            };
        });
    }

    private getTitleHref(jdId: number, source: { id?: number; type?: string }[]): any {
        const path = `/tarc/jd/detail/${jdId}`;

        return this.isOwnedJd(source) ? [path] : path;
    }

    private isOwnedJd(source: { id?: number; type?: string }[]): boolean {
        return this.isCreatedByCurrentUser(source) || this.user.IsAdmin;
    }

    private isCreatedByCurrentUser(source: { id?: number; type?: string }[]) {
        const createdBy = source.find(item => item.type === SourceTypeEnum.CreatedBy);
        return createdBy && this.user.UserId === createdBy.id;
    }

    private async copyJd(jdId: number) {
        const clonedJd = await this.jobDescriptionService.cloneJobDescription(jdId).toPromise();
        this.router.navigate([`tarc/jd/detail/${clonedJd.id}/edit`], { queryParams: { copy: true, sourceJdId: jdId }, state: { parentId: jdId }});
        this.spSharedService.callViewAuditLog(this.applicationTypeEnum.PM, this.applicationTypeEnum.JD, [clonedJd.id], true);
    }

    viewJd(jdId: number) {
        this.router.navigate([`tarc/jd/detail/${jdId}`]);
    }

    editJd(jdId: number) {
        this.router.navigate([`tarc/jd/detail/${jdId}/edit`]);
    }

    async computeContextMenu(job: JdMenuCell) {
        const [permission] = await Promise.all([
            this.getJdPermissions(job.id)
        ]);

        const menuItems: MenuItem[] = [
            { label: this.menuLabels[0], action: (event: MouseEvent, id: number) => this.viewJd(id) },
            { label: this.menuLabels[2], action: (event: MouseEvent, id: number) => this.downloadPdf(event, id, job.title) }
        ];

        if (this.isOwnedJd(job.source)) {
            menuItems.splice(1, 0, {
                label: this.menuLabels[1],
                action: (event: MouseEvent, id: number) => this.editJd(id),
            });
        }
        if (canCopy(permission)) {
            menuItems.push({
                label: this.menuLabels[3],
                action: (event: MouseEvent, id: number) => this.copyJd(id),
            });
        }
        if (this.isOwnedJd(job.source)) {
            menuItems.push({
                label: this.menuLabels[4],
                action: (event: MouseEvent, id: number, title: string) => this.removeJd(id, title),
            });
        }

        return menuItems;
    }

    async onContextMenuClick(event: [JdMenuCell, Dropdown]) {
        this.menuItems = [];
        this.menuItems = await this.computeContextMenu(event[0]);
        event[1].overlay.show();
    }

    async getJdPermissions(id: number) {
        if (this.permissionsCache[id]) {
            return this.permissionsCache[id];
        }

        const res = await this.jobDescriptionService.getJDPermissions(id).toPromise();
        this.permissionsCache[id] = res;
        return res;
    }

    async downloadPdf(event: MouseEvent, jdId: number, jdTitle: string) {
        if (callBulkRunner(event, 'success_profile_single_pdf_export', this.authService.getSessionInfo())) {
            this.spSharedService.downloadSuccessProfileReport(jdId, 'JOB_DESCRIPTION', {
                isProfileManager: true,
                excludeSections: [4],
                locale: this.locale,
                exportName: `Job Description - ${jdTitle}`,
            } as KfISuccessProfileDownloadOptions);
        } else {
            const sp = await this.jobDescriptionService.getSuccessProfileDetail(jdId).toPromise();
            const fullUrl = `${sp.jobExportUrl}&locale=${this.locale}`;
            this.spSharedService.downloadReportWithAudit(fullUrl, sp.title, 'PDF', fileReportType.PM_JOB_DESCRIPTION);
        }
    }
}
