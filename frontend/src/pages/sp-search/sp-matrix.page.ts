import _ from 'lodash';

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    KfAuthService, KfFilterMetadata, KfGrowlService, KfIJobFactor, KfTranslationService, KfStorageService, KfStoreTypeEnum
} from '@kf-products-core/kfhub_lib';
import {
    IKfSpCompareBucketItem, KfISpRolesLoaderService, KfThclSpAccessModel,
    KfThclSpCompareBucketService, KfThclSpRolesLoaderService,
    KfThclSuccessprofileService as KfThclSuccessprofileService
} from '@kf-products-core/kfhub_thcl_lib';

import { KfTarcSpMatrixService } from '../../app/modules/services/kftarc-sp-matrix.service';
import { SpSearchFilterEnum } from './sp-search.constant';
import { getSelectedFiltersFlatten, mapSpSearchFilters } from './sp-search.pure';
import { FiltersState } from './sp-search.reducer';
import { State } from './sp-search.state';
import { Store } from '@ngrx/store';
import { actionFilterRemoveAll } from './sp-search.actions';
import { forkJoin, mergeMap } from 'rxjs';
import { SpTypeEnum } from '@kf-products-core/kfhub_thcl_lib/domain';
import { HttpService } from '../../app/services/http.service';

@Component({
    selector: 'kftarc-sp-matrix-page',
    templateUrl: './sp-matrix.page.html',
    styleUrls: ['./sp-matrix.page.scss'],
    providers: [
        // {
        //     provide: KfISpMatrixLoaderService,
        //     useClass: KfTarcSpMatrixService,
        // },
        {
            provide: KfISpRolesLoaderService,
            useClass: KfThclSpRolesLoaderService,
        },
    ],
})
export class SpMatrixPage implements OnInit, OnDestroy {
    @ViewChild('profileMatchTool') profileMatchTool;

    views = ['list', 'cards'];
    selectedView = 'cards';

    filters: FiltersState;
    selectedFilters: { type: SpSearchFilterEnum; label: string; value: string }[];

    jobFactors: KfIJobFactor[];
    activeRoleId: string;
    showMatchTool = false;

    showGrades = false;
    showShortProfile = false;
    hasExecGradingAccess = false;
    hasCustomGrades = false;

    isBucketExpanded = false;
    spSelected = false;
    spTitle;

    roleSpSelectorVisible = false;
    warningNotificationMessage = '';

    showExecGrading = false;
    execGradingJobId: number;
    execGradingRoleId: number;
    execGradingTitle: string;
    execStandardHayGrade: number;
    selectedRole: { id: string; name: string };

    private referenceJobId: string;

    get isBucketFull(): boolean {
        return this.bucketService.getAvailableSlots() === 0;
    }

    get isBucketEmpty(): boolean {
        return this.bucketService.getAvailableSlots() === this.bucketService.maxItems;
    }

    private selectionChanged = false;
    private subscriptions = [];

    private uniqueIdentifier: string;

    constructor(
        public matrixService: KfTarcSpMatrixService,
        private activatedRoute: ActivatedRoute,
        private authService: KfAuthService,
        private bucketService: KfThclSpCompareBucketService,
        private growlService: KfGrowlService,
        private router: Router,
        private store: Store<State>,
        private successProfileService: KfThclSuccessprofileService,
        private translationService: KfTranslationService,
        private roleSpLoader: KfISpRolesLoaderService,
        private httpService: HttpService,
        public storageService: KfStorageService,
    ) { }

    ngOnInit() {
        const access: KfThclSpAccessModel = this.activatedRoute.parent.snapshot.data.access;
        this.showGrades = access.hasGradeAccess;
        this.hasCustomGrades = access.hasCustomGrades;
        // SP-7079
        this.showShortProfile = false;
        this.successProfileService.hasGradedParent().subscribe((data) => {
            this.hasExecGradingAccess = access.hasExecutiveGradingAccess && data;
        });
        this.warningNotificationMessage = '';
        this.selectionChanged = false;

        let filterIsOn = false;
        if (this.activatedRoute.snapshot.queryParams.filtering === 'on') {
            filterIsOn = true;
        }
        const cachedPermissions = JSON.parse(this.storageService.getItem('metaDataPMFilter', KfStoreTypeEnum.SESSION));
        let [search, filters] = this.activatedRoute.snapshot.data.searchFilters;
        if(cachedPermissions !== null) {
            this.callSearchMetadata();
        }
        if(filters?.length === 0 && cachedPermissions !== null) {
            filters = mapSpSearchFilters(cachedPermissions.searchOn as KfFilterMetadata[], [], {});
        }
        this.filters = _.cloneDeep(_.filter(filters, filter =>
            filter.type[0] === SpSearchFilterEnum.SearchSource ||
            filter.type[0] === SpSearchFilterEnum.Functions ||
            filter.type[0] === SpSearchFilterEnum.ProfileType ||
            filter.type[0] === SpSearchFilterEnum.ProfileCollections
        ));

        const profileTypeFilter = this.filters.find(f => f.type[0] === SpSearchFilterEnum.ProfileType);

        _.remove(profileTypeFilter.items, i => i.value === '1');

        if (filterIsOn) {
            const searchSourceFilter = this.filters.find(f => f.type[0] === SpSearchFilterEnum.SearchSource);
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const profileTypeFilter = this.filters.find(f => f.type[0] === SpSearchFilterEnum.ProfileType);

            const searchSourceMe = searchSourceFilter.items.find(i => i.value === '1');
            searchSourceMe.checked = true;
            const profileTypeCustom = profileTypeFilter.items.find(i => i.value === '4');
            profileTypeCustom.checked = true;
        }
        const selectedFilters = getSelectedFiltersFlatten(this.filters);
        this.selectedFilters = _.isEmpty(selectedFilters) ? null : selectedFilters;
    }

    ngOnDestroy() {
        for (const sub of this.subscriptions) {
            sub.unsubscribe();
        }

        this.growlService.clearInteractiveMessages();
        this.store.dispatch(actionFilterRemoveAll());
    }

    onFilterChange(meta: { filters: { type: SpSearchFilterEnum; label: string; value: string }[] }) {
        if (_.isEmpty(meta.filters)) {
            this.selectedFilters = null;
        } else {
            this.selectedFilters = meta.filters;
        }
    }

    popupDataChanges(data: any): void {
        this.spSelected = false;
        this.warningNotificationMessage = data && data.warningMessage ? data.warningMessage : '';
        if (data) {
            this.spSelected = this.bucketService.hasItem(data.id);
        }
    }

    spSelectionChange(data, event) {
        this.spSelected = event;
        this.selectionChanged = true;
        if (this.spSelected) {
            const item: IKfSpCompareBucketItem = {
                id: data.id,
                title: data.name,
                profileType: SpTypeEnum.Custom,
            };
            this.bucketService.addItems([item]);
        } else {
            this.bucketService.removeItem(data.id);
            if (!this.isBucketFull) {
                this.warningNotificationMessage = '';
            }
        }
    }

    async callSearchMetadata() {
        const cachedPermissions = JSON.parse(this.storageService.getItem('metaDataPMFilter', KfStoreTypeEnum.SESSION));
        if(cachedPermissions === null ) {
            this.httpService.spSearchMetadata(true).pipe(
                mergeMap(res => {
                    this.storageService.setItem('metaDataPMFilter', JSON.stringify(res[0]), KfStoreTypeEnum.SESSION);
                    const filters = mapSpSearchFilters(res[0].searchOn as KfFilterMetadata[], [], {});
                    this.filters = _.cloneDeep(_.filter(filters, filter =>
                        filter.type[0] === SpSearchFilterEnum.SearchSource ||
                        filter.type[0] === SpSearchFilterEnum.Functions ||
                        filter.type[0] === SpSearchFilterEnum.ProfileType ||
                        filter.type[0] === SpSearchFilterEnum.ProfileCollections
                    ));
                    return [this.filters];
                })
            ).subscribe(([filters, search]) => {

            });
        }
    }

    openMatchTool(data): void {
        const { id, name } = data;
        forkJoin([
            this.successProfileService.getJobRoleFactors(id),
            this.roleSpLoader.getSpForRole(id, name)
        ]).subscribe(([factors, roleJobs]) => {
            this.referenceJobId = roleJobs[0].id;
            this.activeRoleId = id;
            this.jobFactors = factors.data;
            this.showMatchTool = true;
            setTimeout(() => this.profileMatchTool.openModal(), 0);
        });
    }

    onMatchToolBtnChange(change: any) {
        if (change.action === 'cancel') {
            this.showMatchTool = false;
            this.referenceJobId = undefined;
        } else {
            this.successProfileService.calculateProfileGradePMT(
                this.activeRoleId,
                change.factor,
                this.referenceJobId)
                .subscribe((res) => {
                    this.referenceJobId = undefined;
                    this.showMatchTool = false;
                    this.router.navigate([`tarc/sp/detail/${res.jobId}`]);
                });
        }
    }

    viewChange(name) {
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

    gotoCompare() {
        this.router.navigate(['tarc/sp/compare']);
    }

    expandChanged(event: boolean): void {
        this.isBucketExpanded = event;
    }

    onRoleSpSelectorClose(): void {
        this.roleSpSelectorVisible = false;
    }

    openRoleSpSelector(role) {
        this.selectedRole = { id: role.id, name: role.name };
        this.roleSpSelectorVisible = true;
    }

    openExecGrading(data) {
        this.execGradingRoleId = data.id;
        this.execGradingJobId = data.jobId;
        this.execGradingTitle = data.name;
        this.execStandardHayGrade = data.standardHayGrade;
        this.showExecGrading = true;
    }

    checkBoxClicked() {
        if (this.isBucketFull && !this.selectionChanged) {
            this.warningNotificationMessage = this.translationService.get('lib.maxComparisonsReached');
        } else {
            this.warningNotificationMessage = '';
            this.selectionChanged = false;
        }
    }

    exportMatrix(event: MouseEvent): void {
        if (this.selectedFilters) {
            const authInfo = this.authService.getSessionInfo();
            const name = _.get(authInfo, ['Client', 'clientName']);
            this.matrixService.exportMatrix(this.selectedFilters || [], this.showShortProfile, name, true);
        }
    }

    getIcon(data): string {
        return data.parentId === 'GNX' ? 'profile-level' : data.subType === 'jobProfile' ? 'profile-task' : 'profile-function';
    }

    shouldShowKfGradeIcon(matrixEntry): boolean {
        // Here we apply different check rule because we do not have full success profile but only matrix data.
        const { value, minCustomValue, maxCustomValue } = matrixEntry;
        return this.hasCustomGrades && value && !minCustomValue && !maxCustomValue;
    }
}
