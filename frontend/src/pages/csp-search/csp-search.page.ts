/* eslint-disable max-classes-per-file */

import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { KfAuthService, KfGrowlMessageType, KfGrowlService, KfIJobFactor, KfILang, KfIMarketInsightsResults, KfIProjectBundle, KfISuccessProfile, KfStorageService, KfTranslationService, KfIAssessmentProducts, KfFilterMetadata } from '@kf-products-core/kfhub_lib';
import { UploadStateEnum, UploadStatusEnum } from '@kf-products-core/kfhub_lib/presentation';
import { KfThclPointRestrictionService, KfThclSpAccessModel, KfThclSpCompareBucketService, KfThclSpMarketInsightsCacheService, KfThclSpMarketInsightsService, KfThclSPSharedConstantsService, KfThclSuccessprofileService as SuccessprofileService, fileReportType } from '@kf-products-core/kfhub_thcl_lib';
import { KfSortDirection, renderCreatedBy, renderGrade, renderModifiedDate, SpTypeEnum } from '@kf-products-core/kfhub_thcl_lib/domain';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import _ from 'lodash';
import { map, take, tap, filter, first, mergeMap } from 'rxjs/operators';
import { forkJoin as observableForkJoin, Subject, Subscription } from 'rxjs';
import { KfTarcJobDescriptionService as JobDescriptionsService } from '../../app/modules/services/kftarc-job-description.service';
import { HttpService } from '../../app/services/http.service';
import { actionFilterQuery, actionFilterRemoveAll, actionSearchChange } from './csp-search-actions';
import { columns, columnSource, menuTerms, CspSearchFilterEnum, SortColumn, workdayColumns, workdayColumnSource, CspSearcColumnEnum } from './csp-search-constants';
import { MenuItem, CspSearch, CspSearchColumns, CspSearchContextMenuProps, CspSearchRow, CspSearchSortableColumn } from './csp-search-model';
import { getSelectedFiltersFlatten, getSpIcon, getSpTypeTerm, mapSpSearchFilters } from './csp-search-pure';
import { FiltersState } from './csp-search-reducer';
import { State } from './csp-search-state';
import { KfTarcSuccessProfileDetailService } from '../../app/modules/components/macro/success-profile/detail/kftarc-success-profile-detail.service';
import { KfIUserPermissions } from '@kf-products-core/kfhub_lib/auth';
import { DEFAULT_PAGE_SIZE } from '../sp-search/sp-search.constant';

@Component({
    selector: 'kftarc-csp-search-page',
    templateUrl: './csp-search.page.html',
    styleUrls: ['./csp-search.page.scss'],
})
export class CspSearchPage implements OnInit, OnDestroy {

    public searchString: string;

    showRemoveModal = false;
    showMatchTool = false;
    shownPublisher = false;
    shownAssessmentModal = false;

    assesmentModalTabSelected = 0;
    isBtnDisabled = true;
    public navigateAwaySelection$: Subject<boolean> = new Subject<boolean>();
    productInputsForm: UntypedFormGroup;
    successProfile: KfISuccessProfile;
    marketInsights: KfIMarketInsightsResults;
    public isSpPdfDownloadOpened = false;
    public showGrade = false;
    private hasCustomGrades: boolean;
    permissions: KfThclSpAccessModel;

    public views = ['list', 'cards'];
    public selectedView = 'list';

    subscriptions$: Subscription[] = [];

    public permissionsCache: { [key: number]: KfIUserPermissions } = {};

    private assessmentCache: { [key: number]: any } = {};

    @ViewChild('profileMatchTool') profileMatchTool;

    columns: string[];
    columnSource: CspSearchColumns;
    dataSource: CspSearchRow[] = [];
    menuItems: MenuItem[] = [];
    menuLabels: string[];
    totalRows: number;
    infiniteScrollDisabled = true;
    spPropsForModals: CspSearchContextMenuProps;
    productTypes: KfIProjectBundle[];

    uploaderState = UploadStateEnum.Empty;
    progressBarState = UploadStatusEnum.Unset;
    uploaderCancelPolling: Subscription;
    uploaderDisabled = false;
    public userLocale = 'en';

    selectedFilters: { type: CspSearchFilterEnum; label: string; value: string }[];
    filters: FiltersState;
    search = '';

    public isCopyModalOpen = false;

    public DOWNLOAD: string;

    public languages: KfILang[] = [];

    public publishCenterType = '';

    public selectedLanguage: KfILang;

    private hasGradeAccess = false;

    public hasLanguageAccess = false;

    public languagesAreMatching = true;

    public searchColumnItems = ['XLS Format', 'CSV Format'];

    public selectedSuccessprofileIds = [];
    public exportToHCMessage = false;

    constructor(
        public datePipe: DatePipe,
        public router: Router,
        public spService: SuccessprofileService,
        public jobDescriptionsService: JobDescriptionsService,
        public authService: KfAuthService,
        public spSharedConstants: KfThclSPSharedConstantsService,
        private translate: TranslateService,
        private formBuilder: UntypedFormBuilder,
        private translationService: KfTranslationService,
        private growlService: KfGrowlService,
        private activatedRoute: ActivatedRoute,
        private bucketService: KfThclSpCompareBucketService,
        public pointRestrictionService: KfThclPointRestrictionService,
        private store: Store<State>,
        private httpService: HttpService,
        public storageService: KfStorageService,
        public miCacheService: KfThclSpMarketInsightsCacheService,
        public marketInsightsDataService: KfThclSpMarketInsightsService,
        private spDetailsService: KfTarcSuccessProfileDetailService,
    ) {
        this.authService.getConfig().subscribe((res: any) => {
            if (res) {
                this.languages = res.phlanguages;
                const localeFromFilter = this.spDetailsService.getLocaleFromFilter();
                if (localeFromFilter) {
                    this.selectedLanguage = this.findSelectedLocale(localeFromFilter);
                } else {
                    const languageCode = this.authService.getSessionInfo().User ? this.authService.getSessionInfo().User.Locale : 'en';
                    this.selectedLanguage = this.findSelectedLocale(languageCode);
                }
            }
        });
        this.hasOrgJobProfileTabAccess();
    }

    public hasOrgJobProfileTabAccess() {
        const sessionInfo = JSON.parse(this.storageService.getItem('sessionInfo'));
        const { isKFSuperAdmin } = sessionInfo.user;
        const hasOrgJobProfile = sessionInfo?.user?.products.some(option => option.id === 222);
        const hasOrgJobProfileTabAccess = this.storageService.getItem('hasOrgJobProfileTabAccess');
        /* Not Showing 'My Org Job Profile Tab when no kfSuperAdmin Access */
        if (!hasOrgJobProfile && hasOrgJobProfileTabAccess !== 'true') {
            this.router.navigate(['tarc/#/login']);
        }
    }

    public onCspsSelect(i) {
        // Map selected items: add selected ones, remove unselected ones
        const selectedIds = i.items.map(item => item.isSelected ? item.id : null).filter(id => id !== null);
        // Add newly selected IDs
        selectedIds.forEach(id => {
            if (!this.selectedSuccessprofileIds.includes(id)) {
                this.selectedSuccessprofileIds.push(id);
            }
        });
        // Remove unselected IDs
        i.items.forEach(item => {
            if (!item.isSelected) {
                this.selectedSuccessprofileIds = this.selectedSuccessprofileIds.filter(id => id !== item.id);
            }
        });
    }

    ngOnInit() {
        this.userLocale = this.authService.getSessionInfo().User ? this.authService.getSessionInfo().User.Locale : 'en';

        const access: KfThclSpAccessModel = this.activatedRoute.snapshot.data.access;

        this.hasGradeAccess = access.hasGradeAccess;

        this.hasLanguageAccess = access.hasLanguageAccess;

        this.permissions = access;

        this.hasCustomGrades = access.hasCustomGrades;

        this.columns = _.clone(columns);
        if (!this.hasGradeAccess) {
            _.pull(this.columns, CspSearcColumnEnum.Grade);
        }
        this.columnSource = _.cloneDeep(columnSource);

        const [search, filters] = this.activatedRoute.snapshot.data.searchFilters;
        this.search = search;
        this.filters = _.cloneDeep(filters); // prevents ngrx immutability issues;
        const profileTypeFilter = this.filters?.find(f => f.type[0] === CspSearchFilterEnum.ProfileType);
        const profileTypeCustom = profileTypeFilter?.items.find(i => i.value === '5');
        if(profileTypeCustom) {
            profileTypeCustom.checked = true;
        }
        this.selectedFilters = getSelectedFiltersFlatten(this.filters);
        this.searchString = this.search;
        this.searchFn({ filters: this.selectedFilters, search: this.searchString }, this.pageIndex, false);
        this.dataSource = this.dataSource.filter(d => d.menu.id === 1011668);
        this.productInputsForm = this.formBuilder.group({
            product: '',
        });
        const subscription$ = this.productInputsForm.valueChanges.subscribe(() => {
            this.isBtnDisabled = false;
        });
        this.subscriptions$.push(subscription$);

        this.reviewTmChange();

        observableForkJoin(_.map(menuTerms, term => this.translate.get(term))).toPromise().then((menuLabels) => {
            this.menuLabels = menuLabels;
        });

        const hasProfileTypeFilter = this.filters.find(f => f.type.includes(CspSearchFilterEnum.ProfileType));
        if (hasProfileTypeFilter) {
            const hasProfileTypeCustom = profileTypeFilter.items.find(i => i.value === '5');
            if (hasProfileTypeCustom) profileTypeCustom.checked = false;
        }

        this.filters = this.filters
            .map(filter => ({
                ...filter,
                items: filter.items.filter(item => item.label !== 'Custom Profiles')
            }))
            .filter(filter =>
                filter.type.some(type =>
                    [
                        CspSearchFilterEnum.Functions,
                        CspSearchFilterEnum.SubFunctions,
                        CspSearchFilterEnum.Grades,
                        CspSearchFilterEnum.Levels
                    ].includes(type)
                )
            );
        this.filters = this.filters.map((filter) => {
            if (filter.term === 'lib.GRADES') {
                return {
                    ...filter,
                    term: 'KF Grade', // Update the term
                };
            }
            return filter;
        });
        this.DOWNLOAD = 'download';
    }

    public onDropdownChange(item: string) {
        let format = '';
        // Determine the format based on the dropdown selection
        if (item === 'XLS Format') {
            format = 'excel';
        } else if (item === 'CSV Format') {
            format = 'csv';
        }
        // Generate a timestamp for the file name
        const timestamp = new Date().toISOString().replace(/T/, '_').replace(/\..+/, '').replace(/:/g, '-');
        const KF_SUFFIX = 'KornFerry_CustomSP_Extract_';
        if (this.selectedSuccessprofileIds && this.selectedSuccessprofileIds.length > 0) {
            this.httpService.downloadFiles(this.selectedSuccessprofileIds, format).subscribe({
                next: (blob: Blob) => {
                    const downloadUrl = window.URL.createObjectURL(blob);
                    const file = document.createElement('a');
                    file.href = downloadUrl;
                    // Set the file name based on the format and timestamp
                    let fileName = '';

                    if (format === 'excel') {
                        fileName = `${KF_SUFFIX}${timestamp}.xlsx`;
                    } else if (format === 'csv') {
                        fileName = `${KF_SUFFIX}${timestamp}.zip`;
                    }
                    file.download = fileName;
                    document.body.appendChild(file);
                    file.click();
                    // Clean up the DOM
                    document.body.removeChild(file);
                    window.URL.revokeObjectURL(downloadUrl);
                    this.publishCenterType = 'download';
                },
                error: (err) => {
                    console.error('Error downloading files:', err);
                    this.publishCenterType = '';
                }
            });
        } else {
            console.warn('No success profile IDs selected.');
        }
    }


    private reviewTmChange() {
        const User = this.authService.getSessionInfo().User;
        const reviewTMChange = _.find(User.Preferences, (pf) => pf.name === 'REVIEW_TM_CHANGE');
        if (reviewTMChange && reviewTMChange.userDefault === '1') {
            setTimeout(async () => {
                const message = `${this.translationService.get('pm.traitsDriversMessage')}`;
                const title = `${this.translationService.get('pm.traitsDriversTitle')}`;
                this.growlService.createInteractiveSuccessMessage(message, title, 0, KfGrowlMessageType.SUCCESS, null);

                await this.spService.updateReviewTMChangePreference(User.UserId, reviewTMChange.id, '0').toPromise();

                const clonedUser = _.cloneDeep(User);
                reviewTMChange.userDefault = '0';
                (clonedUser as any).preferences = [reviewTMChange];
                this.authService.updateSessionInfo({ User: clonedUser });
            }, 10);
        }
    }

    ngOnDestroy() {
        this.growlService.clearInteractiveMessages();
        if (this.subscriptions$) {
            this.subscriptions$.forEach((subscription$: Subscription) => {
                subscription$.unsubscribe();
            });
        }
        this.spService.copyAdded = false;

        this.store.dispatch(actionFilterRemoveAll());

    }

    public viewChange(name) {
        switch (name) {
            case 'list': {
                this.selectedView = name;
                this.router.navigate(['tarc/sp/search']);
                break;
            }
            case 'cards': {
                this.selectedView = name;
                this.router.navigate(['tarc/sp/matrix']);
                break;
            }
        }
    }

    viewWorkdayStatus(event: boolean) {
        if (event) {
            this.columns = columns.concat();
            this.columns.splice(1, 0, ...workdayColumns);
            this.columnSource = _.assign(_.cloneDeep(columnSource), _.cloneDeep(workdayColumnSource));
        } else {
            this.columns = _.concat([], ...columns);
            this.columnSource = _.cloneDeep(columnSource);
        }
    }

    async removeSpChoice(choice: boolean) {
        this.showRemoveModal = false;
        if (choice) {
            await this.authService.deleteSuccessProfile(this.spPropsForModals.id).toPromise();

            this.bucketService.removeItem(this.spPropsForModals.id);

            // this.dataSource = _.filter(this.dataSource, s => s.id !== this.spPropsForModals.id);
            this.totalRows -= 1;

            this.store.dispatch(actionFilterQuery({ excludeFilters: this.hasGradeAccess ? [] : [CspSearchFilterEnum.Grades] }));

        }

        this.unsetSpForModals();
    }

    async callSearchMetadata() {
        if(this.filters.length === 0) {
            this.httpService.spSearchMetadata(true).pipe(
                mergeMap(res => {
                    this.filters = mapSpSearchFilters(res[0].searchOn as KfFilterMetadata[], [], {});
                    this.search = '';
                    const filteredArray = this.filters.map(obj => ({
                        ...obj,
                        items: obj.items.filter(item => item.label !== 'Custom Profiles')
                    }));
                    this.filters = filteredArray;
                    return [this.filters, this.search];
                })
            ).subscribe(([filters, search]) => {
                this.filters = this.filters
                    .map(filter => ({
                        ...filter,
                        items: filter.items.filter(item => item.label !== 'Custom Profiles')
                    }))
                    .filter(filter =>
                        filter.type.some(type =>
                            [
                                CspSearchFilterEnum.Functions,
                                CspSearchFilterEnum.SubFunctions,
                                CspSearchFilterEnum.Grades,
                                CspSearchFilterEnum.Levels
                            ].includes(type)
                        )
                    );
                this.filters = this.filters.map((filter) => {
                    if (filter.term === 'lib.GRADES') {
                        return {
                            ...filter,
                            term: 'KF Grade', // Update the term
                        };
                    }
                    return filter;
                });
            });
        }
    }

    private setPropsForModals(id: number, title?: string, jobRoleTypeId?: string, jobFactors?: KfIJobFactor[], productTypes?: KfIProjectBundle[], isArchitectJob?: boolean) {
        this.spPropsForModals = { id, title, jobRoleTypeId, jobFactors, productTypes, isArchitectJob };
    }

    public unsetSpForModals() {
        this.spPropsForModals = undefined;
    }

    public removeSp(id: number, title: string, jobRoleTypeId?: string, isArchitectJob?: boolean): void {
        this.setPropsForModals(id, title, undefined, undefined, undefined, isArchitectJob);
        this.showRemoveModal = true;
    }

    sorting: CspSearchSortableColumn[] = [];
    pageIndex = 1;
    pageSize = DEFAULT_PAGE_SIZE;
    totalPages = 1;

    async onInputChange(meta: { search: string }) {
        this.store.dispatch(actionSearchChange({ search: meta.search }));

        this.searchString = meta.search;
        this.infiniteScrollDisabled = false;
        this.totalRows = 0;
        this.pageIndex = 1;
        this.searchFn({ search: this.searchString, filters: this.selectedFilters }, this.pageIndex, false);
    }

    async onFilterChange(meta: { filters: { type: CspSearchFilterEnum; label: string; value: string }[] }) {
        this.selectedFilters = meta.filters;
        this.infiniteScrollDisabled = false;
        this.totalRows = 0;
        this.pageIndex = 1;
        this.searchFn({ search: this.searchString, filters: this.selectedFilters }, this.pageIndex, false);
    }

    async scrollDown(event: { pageIndex: number }) {
        this.searchFn({ filters: this.selectedFilters, search: this.searchString }, event.pageIndex);
    }

    private async searchFn(meta: { search: string; filters: { type: CspSearchFilterEnum; label: string; value: string }[] }, pageIndex: number, savePrev = true) {
        this.infiniteScrollDisabled = true;
        const customProfileFilter = {
            type: CspSearchFilterEnum.ProfileType,  // ✅ Use enum instead of string
            label: 'Custom Profiles',
            value: '5'
        };

        // Ensure filters exist and check if "Custom Profiles" filter is already present
        if (!meta.filters || meta.filters.length === 0) {
            meta.filters = [customProfileFilter];
        } else {
            const hasCustomProfileFilter = meta.filters.some(f => f.label === 'Custom Profiles');
            if (!hasCustomProfileFilter) {
                meta.filters.push(customProfileFilter);
            }
        }
        const res = await this.httpService.spCustomSearchFilter(
            SortColumn.JobTitle, meta.search, pageIndex, this.pageSize, this.sorting, meta.filters
        ).toPromise();

        if (!res) {
            // this.dataSource = [];
            return;
        }

        const { jobs, paging } = res;

        const filteredLanguage = meta.filters.find(f => f.type === CspSearchFilterEnum.Language);
        const localeFromFilter = filteredLanguage ? filteredLanguage.value : this.userLocale;

        if (filteredLanguage) {
            this.spDetailsService.setLocaleFromFilter(filteredLanguage.value);
        } else {
            this.spDetailsService.setLocaleFromFilter('');
        }

        const dataSource = this.computeDataSource(jobs, localeFromFilter, this.hasCustomGrades).filter(x=>x.type === 'Custom');
        this.dataSource = savePrev ? _.concat(this.dataSource, dataSource) : dataSource;
        this.pageIndex = +paging.pageIndex;
        this.totalRows = paging.totalResultRecords;
        this.totalPages = paging.totalPages;
        this.infiniteScrollDisabled = this.totalRows === this.dataSource.length;
    }

    sortByColumn(event: {
        id: string;
        direction: KfSortDirection;
        pageIndex?: number;
    }[]) {
        this.sorting = event.map(s => ({
            id: s.id,
            sortBy: s.direction,
            title: this.columnSource[s.id].title,
            sortColumn: this.columnSource[s.id].sortColumn,
        }));

        if (event?.[0]?.pageIndex) {
            this.pageIndex = event[0].pageIndex;
        }

        if (_.isEmpty(event)) {
            return false;
        }

        this.searchFn({ filters: this.selectedFilters, search: this.searchString }, this.pageIndex, false);
    }

    computeDataSource(sps: CspSearch[], locale: string, hasCustomGrades: boolean): CspSearchRow[] {
        return _.map(sps, j => ({
            id: j.id,
            name: {
                text: j.title,
                icon: getSpIcon(j.profileType as SpTypeEnum),
                href: `/tarc/sp/detail/${j.id}`,
            },
            type: this.translate.instant(getSpTypeTerm(j.profileType)),
            grade: j.grade ? renderGrade(j.grade, hasCustomGrades, 'KF') : '-',
            level: 'level' in j ? j.level as string : j.levelName,
            function: 'jobFamilyName' in j ? j.jobFamilyName as string : j.familyName,
            createdBy: renderCreatedBy(j.source),
            date: renderModifiedDate(j.source, locale),
            status: j.exportDetails.exportStatus === 0
                ? this.translate.instant('lib.notExported')
                : j.exportDetails.exportStatus === 1
                    ? this.translate.instant('lib.exported')
                    : j.exportDetails.exportStatus === 2
                        ? this.translate.instant('lib.exportedModified')
                        : '-',
            shortProfile: j.shortProfile,
            menu: {
                id: j.id,
                title: j.title,
                accessRoles: j.accessRoles,
                source: _.map(j.source, s => ({ id: s.id, type: s.type })),
                profileType: j.profileType,
                jobRoleTypeId: j.jobRoleTypeId,
                totalPoints: 'haypoints' in j ? j.haypoints as number : j.totalPoints,
                grade: j.grade,
                standardHayGrade: j.grade.standardHayGrade,
                enableProfileMatchTool: j.enableProfileMatchTool,
                isArchitectJob: j.isArchitectJob,
            },
            jobCode: j.jobCode,
        }));
    }

    async getRegionalNorms() {
        const res = await this.spService.getRegionalNorms().toPromise();

        const { regionalNorms, regionalNormLocations } = res.data;
        this.spService.cacheRegionalNorms(regionalNorms, regionalNormLocations);
    }


    async getAssessmentProducts(id: number): Promise<KfIAssessmentProducts> {
        if (this.assessmentCache[id]) {
            return this.assessmentCache[id];
        }
        const res = await this.spService.getAssessmentProducts(id).toPromise();
        this.assessmentCache[id] = res;
        return res;
    }


    onAssessmentModalTabSelected(event) {
        this.isBtnDisabled = true;
        this.assesmentModalTabSelected = event;
    }

    leavePageChoice(choice: boolean): void {
        this.shownAssessmentModal = false;
        this.unsetSpForModals();

        this.navigateAwaySelection$.next(choice);
    }

    async openMatchTool(id: number, title: string, jobRoleTypeId: string) {
        const { data } = await this.spService.getJobFactors(jobRoleTypeId, id).toPromise();

        this.setPropsForModals(id, title, jobRoleTypeId, data);
        this.showMatchTool = true;

        this.profileMatchTool.openModal();
    }

    public getMarketInsights(): Promise<KfIMarketInsightsResults> {
        const storedSelectedCountry = this.storageService.getItem('_selectedCountry');
        const countryId = JSON.parse(storedSelectedCountry)?.id || 225;

        return this.marketInsightsDataService.getCandidateScarcity({ successProfileId: this.successProfile?.id, countryId: parseInt(countryId, 10) });
    }

    public cancelCopy(): void {
        this.isCopyModalOpen = false;
        this.unsetSpForModals();
    }

    public findSelectedLocale(locale: string): any {
        return this.languages.find((language) => language.id === locale);
    }

    public langsAreMatching(): boolean {
        const localeFromFilter = this.spDetailsService.getLocaleFromFilter();
        return this.hasLanguageAccess && localeFromFilter &&
                localeFromFilter === this.userLocale ||
                !localeFromFilter;
    }

    public exportToHCM(): void {
        const title = `${this.translationService.get('pm.exportToHCM')}`;
        if (this.selectedSuccessprofileIds && this.selectedSuccessprofileIds.length > 0) {
            this.httpService.downloadFiles(this.selectedSuccessprofileIds, 'hcm').subscribe({
                next: (res) => {
                    if (res.status.code === 'RES.200') {
                        const selectedIdsSet = new Set(this.selectedSuccessprofileIds);
                        this.dataSource.forEach(item => {
                            if (selectedIdsSet.has(item.id)) {
                                item.isSelected = false;
                            }
                        });
                        const successMessage = this.translationService.get('pm.ProfileSuccessfullyExported');
                        this.growlService.createInteractiveSuccessMessage(
                            successMessage,
                            null,
                            null,
                            KfGrowlMessageType.SUCCESS
                        );
                        this.selectedSuccessprofileIds = [];
                        this.exportToHCMessage = true;
                        this.publishCenterType = 'export';
                    }
                },
                error: () => {
                    const errorMessage = `${this.translationService.get('pm.exportToHCMFailed')}`;
                    this.growlService.createInteractiveErrorMessage(errorMessage, title, null, KfGrowlMessageType.ERROR);
                    this.publishCenterType = '';
                }
            });
        }
    }

    public handleVisibleMessageChange(isVisible: boolean): void {
        this.exportToHCMessage = isVisible;
    }

    public publishCenter(pcType) {
        sessionStorage.setItem('publishCenterType', JSON.stringify(pcType));
        this.router.navigate(['/tarc/cp/search/publish-center']);
    }

}
