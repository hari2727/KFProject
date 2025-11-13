import { DatePipe } from '@angular/common';
import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { KfAuthService, KfGrowlMessageType, KfGrowlService, KfIJobFactor, KfILang, KfIMarketInsightsResults, KfIProjectBundle, KfISuccessProfile, KfNavigationUtil, KfSharedConstantsService, KfStorageService, KfTranslationService, KfIAssessmentProducts, KFIProfileCollectionDropdown, KfStoreTypeEnum, KfLoadingControllerService } from '@kf-products-core/kfhub_lib';
import { UploadStateEnum, UploadStatusEnum } from '@kf-products-core/kfhub_lib/presentation';
import { KFCopiedSP, KfThclPointRestrictionService, KfThclSpAccessModel, KfThclSpCompareBucketService, KfThclSpMarketInsightsCacheService, KfThclSpMarketInsightsService, KfThclSPSharedConstantsService, KfThclSPSharedService, KfThclSuccessprofileService as SuccessprofileService, fileReportType } from '@kf-products-core/kfhub_thcl_lib';
import { KfSortDirection, canShowMatchTool, canUserDeleteSp, renderCreatedBy, renderGrade, renderModifiedDate, SpTypeEnum } from '@kf-products-core/kfhub_thcl_lib/domain';
import { Dropdown } from '@kf-products-core/kfhub_thcl_lib/presentation';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import _ from 'lodash';
import { forkJoin as observableForkJoin, interval, Subject, Subscription, forkJoin, lastValueFrom } from 'rxjs';
import { map, take, tap, filter, first, mergeMap } from 'rxjs/operators';
import { KfTarcJobDescriptionService as JobDescriptionsService } from '../../app/modules/services/kftarc-job-description.service';
import { HttpService } from '../../app/services/http.service';
import { actionFilterQuery, actionFilterRemoveAll, actionSearchChange } from './sp-search.actions';
import {
    columns,
    columnSource,
    menuTerms,
    SpSearchFilterEnum,
    SortColumn,
    workdayColumns,
    workdayColumnSource,
    SpActionItemEnum,
    SpSearcColumnEnum,
    ProductTypeEnum,
    UAMSelectPermissionCodes,
    DEFAULT_PAGE_SIZE,
} from './sp-search.constant';
import { MenuCell, MenuItem, SpSearch, SpSearchColumns, SpSearchContextMenuProps, SpSearchRow, SpSearchSortableColumn, SelectAssessProducts, SelectAssessProductIdsEnum, SelectAssessProductTypeEnum, SelectAssessProductIdEnum, SelectAssessResponse } from './sp-search.model';
import { canCopy, canDelete, getSelectedFiltersFlatten, getSpIcon, getSpTypeTerm } from './sp-search.pure';
import { FiltersState } from './sp-search.reducer';
import { State } from './sp-search.state';
import { selectFilters, selectSearch } from './sp-search.selectors';
import { KfTarcSuccessProfileDetailService } from '../../app/modules/components/macro/success-profile/detail/kftarc-success-profile-detail.service';
import { KfIUserPermissions } from '@kf-products-core/kfhub_lib/auth';
import { KfISuccessProfileDownloadOptions } from '@kf-products-core/kfhub_thcl_lib/_deprecated/models/kfthcl-i-download-options.model';
import { mapSpSearchFilters } from './sp-search.pure';
import { KfFilterMetadata } from '@kf-products-core/kfhub_lib';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { compareObjects } from '@kf-products-core/kfhub_thcl_lib/_deprecated/components/compare/jobs-compare.pure';
@Component({
    selector: 'kftarc-sp-search-page',
    templateUrl: './sp-search.page.html',
    styleUrls: ['./sp-search.page.scss'],
})
export class SpSearchPage implements OnInit, OnDestroy {

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
    columnSource: SpSearchColumns;
    dataSource: SpSearchRow[] = [];
    menuItems: MenuItem[] = [];
    menuLabels: string[];
    totalRows: number;
    infiniteScrollDisabled = true;
    spPropsForModals: SpSearchContextMenuProps;
    productTypes: KfIProjectBundle[];

    uploaderState = UploadStateEnum.Empty;
    progressBarState = UploadStatusEnum.Unset;
    uploaderCancelPolling: Subscription;
    uploaderDisabled = false;
    public userLocale = 'en';

    selectedFilters: { type: SpSearchFilterEnum; label: string; value: string }[];
    filters: FiltersState;
    
    search = '';

    public isCopyModalOpen = false;

    public languages: KfILang[] = [];

    public selectedLanguage: KfILang;

    private hasGradeAccess = false;

    public hasLanguageAccess = false;

    public languagesAreMatching = true;

    private isIcClientUser = false;

    public clientProfileCollections: KFIProfileCollectionDropdown[] = [];

    public deselectAllOptionAvailable = true;

    public showTheSpinnerLoader = false;

    private selectProducts: SelectAssessProducts[];

    private assessProducts: SelectAssessProducts[];

    private filterSselectProducts: { componentId: string; name: string; access: string }[];

    private filterAssessProducts: { componentId: string; name: string; access: string }[];

    private selectResponse: SelectAssessResponse;
    private assessResponse: SelectAssessResponse;

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
        private libSharedConstants: KfSharedConstantsService,
        private bucketService: KfThclSpCompareBucketService,
        public pointRestrictionService: KfThclPointRestrictionService,
        private store: Store<State>,
        private httpService: HttpService,
        public storageService: KfStorageService,
        public miCacheService: KfThclSpMarketInsightsCacheService,
        public marketInsightsDataService: KfThclSpMarketInsightsService,
        private spDetailsService: KfTarcSuccessProfileDetailService,
        private spSharedService: KfThclSPSharedService,
        private ngZone: NgZone,
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

        if (this.storageService.getItem('_isIcClient')) {
            this.isIcClientUser = JSON.parse(this.storageService.getItem('_isIcClient'));
        }
    }

    async ngOnInit() {
        this.userLocale = this.authService.getSessionInfo().User ? this.authService.getSessionInfo().User.Locale : 'en';

        const access: KfThclSpAccessModel = this.activatedRoute.snapshot.data.access;

        this.hasGradeAccess = access.hasGradeAccess;

        this.hasLanguageAccess = access.hasLanguageAccess;

        this.permissions = access;

        this.hasCustomGrades = access.hasCustomGrades;

       

        this.columns = _.clone(columns);
        if (!this.hasGradeAccess) {
            _.pull(this.columns, SpSearcColumnEnum.Grade);
        }
        this.columnSource = _.cloneDeep(columnSource);

        let filterIsOn = false;
        if (this.activatedRoute.snapshot.queryParams.filtering === 'on') {
            filterIsOn = true;
        }
        let [search, filters] = this.activatedRoute.snapshot.data.searchFilters;
        this.callSearchMetadata()
        this.search = search;
        this.filters = _.cloneDeep(filters); // prevents ngrx immutability issues;
        if (filterIsOn) {
            const searchSourceFilter = this.filters.find(f => f.type[0] === SpSearchFilterEnum.SearchSource);
            const profileTypeFilter = this.filters.find(f => f.type[0] === SpSearchFilterEnum.ProfileType);

            const searchSourceMe = searchSourceFilter.items.find(i => i.value === '1');
            searchSourceMe.checked = true;
            const profileTypeCustom = profileTypeFilter.items.find(i => i.value === '4');
            profileTypeCustom.checked = true;
        }
        this.selectedFilters = getSelectedFiltersFlatten(this.filters);
        this.searchString = this.search;
        this.searchFn({ filters: this.selectedFilters, search: this.searchString }, this.pageIndex, false);

        this.productInputsForm = this.formBuilder.group({
            product: '',
        });
        const subscription$ = this.productInputsForm.valueChanges.subscribe(() => {
            this.isBtnDisabled = false;
        });
        this.subscriptions$.push(subscription$);

        this.menuLabels = menuTerms;

        this.reviewTmChange();

        observableForkJoin(_.map(menuTerms, term => this.translate.get(term))).toPromise().then((menuLabels) => {
            this.menuLabels = menuLabels;
        });
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

            this.dataSource = _.filter(this.dataSource, s => s.id !== this.spPropsForModals.id);
            this.totalRows -= 1;

            this.store.dispatch(actionFilterQuery({ excludeFilters: this.hasGradeAccess ? [] : [SpSearchFilterEnum.Grades] }));

        }

        this.unsetSpForModals();
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

    sorting: SpSearchSortableColumn[] = [];
    pageIndex = 1;
    pageSize = DEFAULT_PAGE_SIZE;
    totalPages = 1;

    async onInputChange(meta: { search: string }) {
        this.store.dispatch(actionSearchChange({ search: meta.search }));

        this.searchString = meta.search.trim();
        this.infiniteScrollDisabled = false;
        this.totalRows = 0;
        this.pageIndex = 1;
        this.searchFn({ search: this.searchString, filters: this.selectedFilters }, this.pageIndex, false);
    }

    async callSearchMetadata(){  
            this.httpService.spSearchMetadata(true).pipe(
                mergeMap(res => {
                        this.storageService.removeItem('metaDataPMFilter');
                        this.storageService.setItem('metaDataPMFilter', JSON.stringify(res[0]), KfStoreTypeEnum.SESSION);
                        const cache:KfFilterMetadata = JSON.parse(this.storageService.getItem('metaDataPMFilter', KfStoreTypeEnum.SESSION));
                        this.filters = mapSpSearchFilters(res[0].searchOn as KfFilterMetadata[], [], {});
                        // Compare the values of the filters with the selected filters and set checked = true if available
                        this.filters.forEach(filter => {
                            filter.items.forEach(item => {
                                const isSelected = this.selectedFilters.some(selected => 
                                    filter.type.includes(selected.type) && selected.value === item.value
                                );
                                item.checked = isSelected;
                            });
                        });
                        this.showTheSpinnerLoader = false;
                        return [this.filters, this.search];
                })
            ).subscribe(() => {

            });
    }

    callLoaderifNeeded(){
        const cachedPermissions = JSON.parse(this.storageService.getItem('metaDataPMFilter', KfStoreTypeEnum.SESSION));
       if(cachedPermissions === null ){ 
           this.showTheSpinnerLoader = true;
       }
    }

    async onFilterChange(meta: { filters: { type: SpSearchFilterEnum; label: string; value: string }[] }) {
        this.selectedFilters = meta.filters;
        this.infiniteScrollDisabled = false;
        this.totalRows = 0;
        this.pageIndex = 1;
        this.searchFn({ search: this.searchString, filters: this.selectedFilters }, this.pageIndex, false);
    }

    async scrollDown(event: { pageIndex: number }) {
        this.searchFn({ filters: this.selectedFilters, search: this.searchString }, event.pageIndex);
    }

    private async searchFn(meta: { search: string; filters: { type: SpSearchFilterEnum; label: string; value: string }[] }, pageIndex: number, savePrev = true) {
        this.infiniteScrollDisabled = true;

        const res = await this.httpService.spSearchFilter(
            SortColumn.JobTitle, meta.search, pageIndex, this.pageSize, this.sorting, meta.filters
        ).toPromise();

        if (!res) {
            this.dataSource = [];
            return;
        }

        const { jobs, paging } = res;

        const filteredLanguage = meta.filters.find(f => f.type === SpSearchFilterEnum.Language);
        const localeFromFilter = filteredLanguage ? filteredLanguage.value : this.userLocale;

        if (filteredLanguage) {
            this.spDetailsService.setLocaleFromFilter(filteredLanguage.value);
        } else {
            this.spDetailsService.setLocaleFromFilter('');
        }

        const dataSource = this.computeDataSource(jobs, localeFromFilter, this.hasCustomGrades);

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

    computeDataSource(sps: SpSearch[], locale: string, hasCustomGrades: boolean): SpSearchRow[] {
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
            }
        }));
    }


    async computeContextMenu(job: MenuCell) {
        const languagesAreMatching = this.langsAreMatching();
        const ClientId = this.authService.getSessionInfo().Client.ClientId;
        const UserId = this.authService.getSessionInfo().User.UserId;
        if(!this.selectResponse && !this.assessResponse) {
            [this.selectResponse, this.assessResponse] = await lastValueFrom(
                forkJoin([
                    this.spService.getUamSelectAssessProducts(ClientId, UserId,
                                                              SelectAssessProductIdEnum.ProductId, SelectAssessProductIdsEnum.Select),
                    this.spService.getUamSelectAssessProducts(ClientId, UserId,
                                                              SelectAssessProductIdEnum.ProductId, SelectAssessProductIdsEnum.Assess),
                ])
            );
        }

        this.selectProducts = this.selectResponse.user.productLine?.flatMap(sel =>
            sel?.countries[0]?.product.map(product => ({
                componentId: product.componentId,
                name: product.name,
                access: product.access,
                permissionId: product.permissionId,
                subText: product.subText,
                expiredProduct: product.expiredProduct,
                options: [{
                    permissionId: product.option.permissionId,
                    permissionName: product.option.permissionName
                }],
                productLineSubComponent: product.productLineSubComponent
            })) || []
        ) || [];


        this.filterSselectProducts = this.selectProducts.map(product => ({
            name: product.name,
            componentId: product.componentId,
            access: product.access
        }));
        this.assessProducts = this.assessResponse.user.productLine?.flatMap(sel =>
            sel?.countries[0]?.product.map(product => ({
                componentId: product.componentId,
                name: product.name,
                access: product.access,
                permissionId: product.permissionId,
                subText: product.subText,
                expiredProduct: product.expiredProduct,
                options: [{
                    permissionId: product.option.permissionId,
                    permissionName: product.option.permissionName
                }],
                productLineSubComponent: product.productLineSubComponent
            })) || []
        ) || [];
        this.filterAssessProducts = this.assessProducts.map(product => ({
            name: product.name,
            componentId: product.componentId,
            access: product.access
        }));
        const [permission, canCreateAssessmentProject] = await Promise.all([
            this.getSpPermissions(job.id), this.canCreateAssessmentProject(job.id)
        ]);

        let menuItems: MenuItem[] = [
            {
                label: this.menuLabels[1],
                action: (id: number) => this.createJobDescription(id),
                actionType: SpActionItemEnum.CreateJD,
                isDisabled: !languagesAreMatching,
            },
            {
                label: this.menuLabels[2],
                action: (id: number) => this.downloadPdf(id),
                actionType: SpActionItemEnum.DownloadPDF
            }
        ];

        if (canCopy(permission) && this.isSpSaveEnabled(job.totalPoints)) {
            menuItems.unshift({
                label: this.menuLabels[0],
                action: (id: number, title: string) => this.openCopyModal(id, title),
                actionType: SpActionItemEnum.CopySP
            });
        }

        if (canDelete(permission) ||
            canUserDeleteSp(
                this.authService.getSessionInfo().User.UserId,
                { ...job, accessRoles: permission.access })
        ) {
            menuItems.push({
                label: this.menuLabels[3],
                action: (id: number, title: string, jobRoleTypeId?: string, isArchitectJob?: boolean) => this.removeSp(id, title, undefined, isArchitectJob),
                actionType: SpActionItemEnum.RemoveSP
            });
        }

        if (canCreateAssessmentProject && !this.createAssessmentProjectForbidden(permission)) {
            menuItems.push({
                label: this.menuLabels[4],
                action: (id: number) => this.createAssessmentProject(id),
                actionType: SpActionItemEnum.CreateAssessmentPrj,
                isDisabled: !languagesAreMatching,
            });
        }

        if (canShowMatchTool(job)) {
            menuItems.push({
                label: this.menuLabels[5],
                action: (id: number, title: string, jobRoleTypeId: string) => this.openMatchTool(id, title, jobRoleTypeId),
                actionType: SpActionItemEnum.ProfileMatchTool
            });
        }

        if (this.isIcClientUser) {
            menuItems = menuItems.filter((menuItem) => menuItem.actionType !== SpActionItemEnum.CreateJD);
        }

        return menuItems;
    }

    private createAssessmentProjectForbidden(permission: KfIUserPermissions): boolean {
        if (!('hasCreateAssessProject' in permission) || !('hasCreateSelectProject' in permission)) {
            return false;
        }

        return !permission.hasCreateAssessProject && !permission.hasCreateSelectProject;
    }


    onFileAttach(file: File) {
        this.uploaderState = UploadStateEnum.Progress;
        this.uploaderDisabled = true;

        const res = [UploadStatusEnum.Uploading, UploadStatusEnum.Parsing, UploadStatusEnum.FileError] as UploadStatusEnum[];

        if (this.uploaderCancelPolling) {
            this.uploaderCancelPolling.unsubscribe();
        }
        this.uploaderCancelPolling = interval(2000).pipe(
            take(res.length),
            map(i => res[i]),
            tap(status => {
                this.progressBarState = status;
                this.uploaderState = status === UploadStatusEnum.Uploading || UploadStatusEnum.Parsing
                    ? UploadStateEnum.Progress : UploadStateEnum.Error;
            }),
        ).subscribe();
    }

    onCancelAttach() {
        this.uploaderCancelPolling.unsubscribe();
        this.uploaderState = UploadStateEnum.Empty;
        this.progressBarState = UploadStatusEnum.Unset;
        this.uploaderDisabled = false;

    }

    async onContextMenuClick(event: [MenuCell, Dropdown]) {
        this.menuItems = [];
        this.menuItems = await this.computeContextMenu(event[0]);
        event[1].overlay.show();
    }

    async getSpPermissions(id: number) {
        if (this.permissionsCache[id]) {
            return this.permissionsCache[id];
        }
        const res: KfIUserPermissions = await this.spService.getSPPermissions(id).toPromise();
        this.permissionsCache[id] = res;
        return res;
    }


    private async canCreateAssessmentProject(id: number) {
        const userProducts = this.authService.getSessionInfo().User.Products;
        if (_.some(userProducts, p => p.productName === 'Talent Management' || p.productName === 'Talent Acquisition')) {
            const products: KfIAssessmentProducts = await this.getAssessmentProducts(id);
            const checkForAllproductTypeEmptiness = products?.productTypes.some(item =>
                item.products && item.products.some(product => product !== null && product !== undefined)
            );
            if (products?.productTypes && checkForAllproductTypeEmptiness) {
                return true;
            }
        }
        return false;
    }

    private isSpSaveEnabled(totalPoints: number) {
        return !totalPoints || this.pointRestrictionService.isSaveEnabled(totalPoints);
    }

    async getRegionalNorms() {
        const res = await this.spService.getRegionalNorms().toPromise();

        const { regionalNorms, regionalNormLocations } = res.data;
        this.spService.cacheRegionalNorms(regionalNorms, regionalNormLocations);
    }

    private openCopyModal(id: number, title: string): void {
        this.setPropsForModals(id, title);
        this.spService.getClientProfileCollections().subscribe(
            collections => {
                this.clientProfileCollections = collections.map(({ profileCollectionsName, profileCollectionId, ...collection }) => ({
                    ...collection,
                    name: profileCollectionsName,
                    id: profileCollectionId,
                }));
                this.isCopyModalOpen = true;
            }
        );
    }

    async copySp(id: number, jobCode?: string, jobTitle?: string, profileCollectionsIds?: number[]) {
        this.isCopyModalOpen = false;

        await this.getRegionalNorms();

        const originalLocale = this.spDetailsService.getLocaleFromFilter() || undefined;

        const localeFromFilter = this.selectedLanguage ? this.selectedLanguage.id : this.spDetailsService.getLocaleFromFilter();

        this.spDetailsService.setLocaleFromFilter(this.selectedLanguage.id);

        this.spService.cloneSuccessProfile(
            id,
            localeFromFilter,
            jobCode,
            jobTitle,
            this.hasLanguageAccess,
            originalLocale,
            profileCollectionsIds,
        ).toPromise().then((sp: KfISuccessProfile) => {
            this.ngZone.run(() => {
                this.router.navigate([`tarc/sp/detail/${sp.id}`]);
            });
        });
    }

    createJobDescription(id: number): void {
        if (!this.langsAreMatching()) {
            return;
        }
        this.router.navigate(['tarc/jd/detail/new/edit'], { queryParams: { fromSPId: id } });
    }

    async downloadPdf(spId: number): Promise<void> {
        this.successProfile = await this.spService.getSuccessProfileDetail(spId).toPromise();
        this.marketInsights = await this.getMarketInsights();

        this.isSpPdfDownloadOpened = true;
    }

    public toggleSpPdfDownload(visible: boolean): void {
        this.isSpPdfDownloadOpened = visible;
    }

    async getAssessmentProducts(id: number): Promise<KfIAssessmentProducts> {
        if (this.assessmentCache[id]) {
            return this.assessmentCache[id];
        }
        const res = await this.spService.getAssessmentProducts(id).toPromise();

        res.productTypes.forEach(productType => {
            if (productType.name === SelectAssessProductTypeEnum.Select) {
                const filterSelectByTypeResult = productType.products.map(product => {
                    const filterSelectByType = this.filterSselectProducts.find(checkForSelectProducts => {
                        const trimmedFixName = checkForSelectProducts.name.trim().replace(/_/g, ' ').toLowerCase();
                        const trimmedProductName = product.type.trim().replace(/_/g, ' ').toLowerCase();
                        return (trimmedFixName === trimmedProductName ||
                                 trimmedFixName === UAMSelectPermissionCodes.Management &&
                                 trimmedProductName === UAMSelectPermissionCodes.Managerial) && checkForSelectProducts.access === '1';
                    });
                    if (filterSelectByType) {
                        return {
                            ...product,
                            componentId: filterSelectByType.componentId,
                            access: filterSelectByType.access
                        };
                    }
                });
                productType.products = filterSelectByTypeResult;
            } else if (productType.name === SelectAssessProductTypeEnum.Assess) {
                const filterAssessByTypeResult = productType.products.map(product => {
                    const filterAssessByType = this.filterAssessProducts.find(checkForAssessProducts => {
                        const trimmedFixName = checkForAssessProducts.name.trim().replace(/[_+]/g, ' ').toLowerCase();
                        const trimmedProductName = product.type.trim().replace(/[_+]/g, ' ').toLowerCase();
                        if((trimmedFixName === trimmedProductName ||
                            (trimmedFixName === UAMSelectPermissionCodes.Professional && trimmedProductName === UAMSelectPermissionCodes.ProfessionalDevelopment) ||
                            (trimmedFixName === UAMSelectPermissionCodes.Leadership && trimmedProductName === UAMSelectPermissionCodes.LeadershipSelection))
                        && checkForAssessProducts.access === '1') {
                            return product;
                        }
                    });

                    if (filterAssessByType) {
                        return {
                            ...product,
                            componentId: filterAssessByType.componentId,
                            access: filterAssessByType.access
                        };
                    }
                });
                productType.products = filterAssessByTypeResult;
            }
        });
        this.assessmentCache[id] = res;
        res.productTypes = res.productTypes.filter((productType) => {
            productType.products = productType.products.filter((product) => product !== undefined);
            return productType.products.length > 0;
        });
        return res;
    }

    createAssessmentProject(id: number) {
        if (!this.langsAreMatching()) {
            return;
        }
        this.shownAssessmentModal = true;

        const productTypes: KfIProjectBundle[] = this.assessmentCache[id].productTypes;

        this.checkPermissionAndRemoveProductType(id, 'hasCreateAssessProject', productTypes, ProductTypeEnum.Assess);

        this.checkPermissionAndRemoveProductType(id, 'hasCreateSelectProject', productTypes, ProductTypeEnum.Select);

        this.setPropsForModals(id, undefined, undefined, undefined, productTypes);
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

    downloadReport(data: { excludeSections: number[]; isShowLevels: boolean; callBulkRunner: boolean }) {
        const storedSelectedCountry = this.storageService.getItem('_selectedCountry');
        const countryId = JSON.parse(storedSelectedCountry)?.id || 225;
        const storedLocaleFromFilter = this.spDetailsService.getLocaleFromFilter();

        if (data.callBulkRunner) {
            this.spSharedService.downloadSuccessProfileReport(this.successProfile.id, 'SUCCESS_PROFILE', {
                isProfileManager: true,
                hideLevels: Number(!data.isShowLevels),
                excludeSections: data.excludeSections || [],
                countryId: Number(countryId),
                locale: storedLocaleFromFilter,
                exportName: `Success Profile - ${this.successProfile.title}`,
            } as KfISuccessProfileDownloadOptions);

        } else {
            let url = `${this.successProfile.jobExportUrl}${countryId}`;

            if (storedLocaleFromFilter) {
                url += `&locale=${storedLocaleFromFilter}`;
            }

            if (!data.isShowLevels) {
                url += '&hideLevels=1';
            }

            if (data.excludeSections.length) {
                url += `&excludeSections=${data.excludeSections.join(',')}`;
            }

            this.spSharedService.downloadReportWithAudit(url, this.successProfile.title, 'PDF', fileReportType.PM_SP_DESCRIPTION);
        }
    }

    async continuePageChoice() {
        if (this.productInputsForm.value.product) {
            let product;

            const productTypes = this.spPropsForModals.productTypes;
            productTypes.forEach((productType) => {
                const findType = productType.products.find(p => p.type === this.productInputsForm.value.product);
                if (findType) {
                    product = productType;
                }
            });
            const appArray = [this.libSharedConstants.PRODUCT_TACQ, this.libSharedConstants.PRODUCT_TAMG];
            appArray.forEach((app) => {
                if (app.productId === product.id) {
                    KfNavigationUtil.navigateMenu(this.router, app.shortName, '/ap/redirect', {
                        queryParams: {
                            type: this.productInputsForm.value.product,
                            spId: this.spPropsForModals.id,
                            country: 'US',
                        },
                    });
                }
            });
        }
    }

    async onMatchToolBtnChange(change: any) {
        if (change.action === 'cancel') {
            this.showMatchTool = false;
        } else {
            const res = await this.spService.calculateProfileGrade(
                this.spPropsForModals.id, this.spPropsForModals.jobRoleTypeId, change.factor
            ).toPromise();

            this.showMatchTool = false;
            this.router.navigate([`tarc/sp/detail/${res.jobId}`]);
        }
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

    public onCopySP(sp: KFCopiedSP): void {
        if (sp.selectedLanguage) {
            this.selectedLanguage = sp.selectedLanguage;
        }

        this.copySp(sp.id, sp.jobCode, sp.title, sp.profileCollectionsIds);
    }

    public langsAreMatching(): boolean {
        const localeFromFilter = this.spDetailsService.getLocaleFromFilter();
        return this.hasLanguageAccess && localeFromFilter &&
                localeFromFilter === this.userLocale ||
                !localeFromFilter;
    }

    public checkPermissionAndRemoveProductType(
        id: number,
        permissionKey: string,
        productTypes: KfIProjectBundle[],
        productTypeToRemove: string,
    ): void {
        const permissionsCache = this.permissionsCache[id];
        // Exclude the productType that are not available for the user based on UAM permissions
        if (permissionsCache && permissionKey in permissionsCache && !permissionsCache[permissionKey]) {
            _.remove(productTypes, (productType) => productType.type === productTypeToRemove);
        }
    }
}
