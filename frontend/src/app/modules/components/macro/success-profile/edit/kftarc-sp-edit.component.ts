import * as _ from 'lodash';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { KfISuccessProfile, KfISpSource, KfAuthService } from '@kf-products-core/kfhub_lib';
import { KfThclSpCompareBucketService, KfThclSuccessprofileService, LoadStatusEnum } from '@kf-products-core/kfhub_thcl_lib';
import { getSMCXSurveyScopes } from '@kf-products-core/kfhub_lib/tracking';
import { KfTarcSuccessProfileDetailService } from '../detail/kftarc-success-profile-detail.service';
import { isExecLevelProfile } from '@kf-products-core/kfhub_thcl_lib/domain';
import { filter } from 'rxjs/operators';
import { Observable, Observer, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../core/core.state';
import { selectLocale } from '../../../../../core/effects/core.selectors';
import { KfIUserPermissions } from '@kf-products-core/kfhub_lib/auth';
import { actionLocaleQuery } from '../../../../../core/effects/core.actions';

@Component({
    selector: 'kftarc-sp-edit',
    templateUrl: './kftarc-sp-edit.component.html',
    styleUrls: ['./kftarc-sp-edit.component.scss'],
})

export class KfTarcSPEditComponent implements OnInit {

    readonly surveyScope = getSMCXSurveyScopes().ProfileManager;

    public successProfile: KfISuccessProfile;
    public assessmentRequirements: any;
    public showKfGradeIcon: boolean;

    @Output() successProfileSave: EventEmitter<number> = new EventEmitter<number>();

    isEditable = false;

    private isNavigateToDetail = false;

    public localeFromFilter: string;

    public navigateAwaySelection$: Subject<boolean> = new Subject<boolean>();

    public hasLanguageAccess = false;

    private permissions: KfIUserPermissions;

    private userLocale = 'en';

    public originalLocale: string;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public successProfileService: KfThclSuccessprofileService,
        protected bucketService: KfThclSpCompareBucketService,
        private spDetailsService: KfTarcSuccessProfileDetailService,
        private authService: KfAuthService,
        private store: Store<AppState>,
    ) {
        this.userLocale = this.authService.getSessionInfo().User.Locale || 'en';
        this.localeFromFilter = this.spDetailsService.getLocaleFromFilter() || this.userLocale;

        // Original Locale is set once when user naviates to edit page
        this.originalLocale = this.spDetailsService.getLocaleFromFilter() || this.userLocale;
    }

    ngOnInit() {
        if (this.successProfileService.getSuccessProfileBackup()) {
            this.successProfile = _.cloneDeep(this.successProfileService.getSuccessProfileBackup());
        } else {
            this.successProfile = _.cloneDeep(this.successProfileService.getStorageBackupSuccessProfile());
        }
        if (this.successProfile == null) {
            return this.router.navigate(['../'], { relativeTo: this.activatedRoute });
        }
        this.isEditable = this.evaluateIfCustom();

        this.assessmentRequirements = this.successProfileService.getLastAssessmentRequirements();
        this.showKfGradeIcon = this.activatedRoute.snapshot.data.access
            && this.activatedRoute.snapshot.data.access.hasCustomGrades
            && Object.prototype.hasOwnProperty.call(this.successProfile, 'grade')
            && !Object.prototype.hasOwnProperty.call(this.successProfile.grade, 'customGrades')
            && !isExecLevelProfile(+this.successProfile.standardHayGrade);

        if (this.successProfile && !this.successProfile.jobCode) {
            this.successProfile.jobCode = '';
        }

        const localeStateSub = this.store.pipe(
            select(selectLocale),
            filter((localeState) => localeState.loadStatus === LoadStatusEnum.LOADED),
        ).subscribe((localeState) => {
            if (this.userLocale &&
            localeState.locale && localeState.locale === this.userLocale) {
                this.navigateAwaySelection$.next(true);
            }
        });

        const permissions = this.authService.getPermissions();

        this.hasLanguageAccess = permissions.hasLanguageAccess;
    }

    onSuccessProfileSave(event: number) {
        const successprofileId = this.successProfile ? this.successProfile.id : -1;
        const successprofileTitle = this.successProfile ? this.successProfile.title : '';
        const items = this.bucketService.getItems();
        const newItems = _.map(items, (item) => item.id === successprofileId ? { ...item, title: successprofileTitle } : item);
        this.bucketService.setItems(newItems);
        this.successProfileSave.emit(successprofileId);
        this.redirectToDetailPage();
    }

    redirectToDetailPage(event?: any) {
        this.isNavigateToDetail = true;
        const successProfileId = event?.event ? event?.event : this.successProfile.id;
        const navigationPath = [`tarc/sp/detail/${successProfileId}`];
        const navigationExtras = event?.isClone ? {} : { state: { restrictAuditCall: 'yes' } };
        this.router.navigate(navigationPath, navigationExtras);
    }

    protected getSuccessProfileUserId(): number {
        let returnValue = -1;
        if (this.successProfile.sources) {
            const sourceFound =
                this.successProfile.sources.find((source: KfISpSource) => source.type === 'CREATED_BY');
            if (sourceFound) {
                returnValue = sourceFound.id;
            }
        }
        return returnValue;
    }

    protected evaluateIfCustom(): boolean {
        if (!this.successProfile.accessRoles || !this.successProfile.profileType) {
            return false;
        }
        return this.successProfile.accessRoles.includes('EDIT') && !this.successProfile.isTemplateJob;
    }

    public onLocaleFromFilterChanged(localeFromFilter: string): void {
        if (localeFromFilter) {
            this.spDetailsService.setLocaleFromFilter(localeFromFilter);
        }
    }

    public canDeactivate(): Observable<boolean> | boolean {
        if (this.isNavigateToDetail || !this.hasLanguageAccess) {
            if (this.hasLanguageAccess) {
                this.successProfileService.resetCacheDescriptionsData();
            }
            return true;
        }

        if (!this.isNavigateToDetail && this.userLocale) {
            const languagePreferenceId = 6;
            this.store.dispatch(actionLocaleQuery({
                languagePreferenceId,
                locale: this.userLocale,
            }));
        }

        return new Observable((observer: Observer<boolean>) => {
            this.navigateAwaySelection$.subscribe((choice) => {

                if (choice) {
                    observer.next(choice);
                    observer.complete();
                }

            });
        });
    }
}
