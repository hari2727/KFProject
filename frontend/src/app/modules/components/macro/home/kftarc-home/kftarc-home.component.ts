import { switchMap } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { KfTarcSummary, JobDescription, SPDescription, DownloadsData } from '../../../../models/kftarc-summary.model';
import {
    KfIDonutDetailedItem,
    KfChartStyleBuilder,
    KfChartStyle,
    KfAuthService,
    KfUtilsService,
    KfStorageService,
    KfBanner,
    KfBannerService,
    KfSharedConstantsService,
    callBulkRunner,
    KfStoreTypeEnum, 
    KfFilterMetadata
} from '@kf-products-core/kfhub_lib';
import { map, take, difference, get } from 'lodash';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { KfThclSuccessprofileService, KfThclSPSharedService, fileReportType, KfThclTalentArchitectConstantsService } from '@kf-products-core/kfhub_thcl_lib';
import dayjs from 'dayjs';
import { TranslateService } from '@ngx-translate/core';
import {
    KfISuccessProfileDownloadOptions
} from '@kf-products-core/kfhub_thcl_lib/_deprecated/models/kfthcl-i-download-options.model';
@Component({
    selector: 'kftarc-home',
    templateUrl: './kftarc-home.component.html',
    styleUrls: ['./kftarc-home.component.scss'],
})
export class KfTarcHomeComponent implements OnInit, OnDestroy {
    private disposables = [];

    private donutColorMap = {
        1: '#45b7de',
        2: '#3acdd2',
        3: '#32b5a0',
        4: '#32b561',
        5: '#85c319',
        6: '#cedc46',
    };

    public advList = ['tacq', 'tamg', 'payh', 'snl', 'inst'];

    public barStyleFunction = new KfChartStyleBuilder()
        .for(KfChartStyle.bar, (d) => ({ fill: '#d0da5b', background: '#f1f3ca', size: 8 }))
        .for(KfChartStyle.label, (d) => {
            const text = `${d}%`;
            return { text, fontSize: 9, fontWeight: 600 };
        });
    public fg: UntypedFormGroup;

    public donutData: KfIDonutDetailedItem[];
    public functionNames: string[];
    public functionValues: number[];
    public functionHeight = 0;

    public profileCount: number;
    public profiles: SPDescription[];

    public jobCount: number;
    public jobs: JobDescription[];

    public downloads: DownloadsData[];
    public hasCLM = false;

    public isPrivacyPolicyOpen = false;
    public privacyPolicyChecked = false;
    private recentlyFiltered = 'RECENTLY_MODIFIED';

    private banners: KfBanner[] = this.bannersService.getBanners();

    private utilityBannerShown = Number(this.storageService.getItem('showBanner') === 'true');

    public get totalBanners() {
        return this.banners.length + this.utilityBannerShown;
    }

    private subs: Subscription[] = [];

    public isShadowMode = !!this.storageService.getItem(this.sharedConstants.SHADOW_CLIENT_KEY);
    public hideTooltip = true;
    public isIcClientUser = false;

    constructor(
        private spService: KfThclSuccessprofileService,
        private spSharedService: KfThclSPSharedService,
        private router: Router,
        private authService: KfAuthService,
        private utils: KfUtilsService,
        private translate: TranslateService,
        public storageService: KfStorageService,
        private bannersService: KfBannerService,
        private sharedConstants: KfSharedConstantsService,
        private cdr: ChangeDetectorRef,
        private talentArchitectConstants: KfThclTalentArchitectConstantsService,
    ) { }

    ngOnInit() {
        const user = this.authService.getSessionInfo().User;
        const cachedPermissions = JSON.parse(this.storageService.getItem('metaDataPMFilter', KfStoreTypeEnum.SESSION));
        if(cachedPermissions === null){
            this.callSearchMetadata()
        }
        if (user.ClientId === this.sharedConstants.DEMO_CLIENT_FOR_PRIVACY_POLICY_ID) {
            this.subs.push(
                this.authService.getShowDemoClientPrivacyPolicyFlag(user.UserId, user.ClientId).subscribe((flag: boolean) => {
                    if (flag) {
                        this.authService.showDemoClientPrivacyPolicy();
                    }
                })
            );
        }

        if (this.storageService.getItem('_isIcClient')) {
            this.isIcClientUser = JSON.parse(this.storageService.getItem('_isIcClient'));
        }
        this.subs.push(
            this.bannersService.banners.subscribe(banners => {
                this.banners = banners;
            }),
            this.authService.getSpContentUpdateSub().subscribe((res) => {
                this.utilityBannerShown = Number(res?.showBanner || false);
            })
        );

        // Initialize form
        this.fg = new UntypedFormGroup({
            dropdownSP: new UntypedFormControl(),
            dropdownJD: new UntypedFormControl(),
        });

        // Set initial value immediately
        this.fg.controls.dropdownSP.setValue('RECENTLY_MODIFIED');

        // Set up subscription after form initialization
        const s1 = this.fg.get('dropdownSP').valueChanges.pipe(switchMap(
            (filterBy) => {
                this.recentlyFiltered = filterBy;
                return this.spService.getSPSummary({ filterBy, type: 'SUCCESS_PROFILE' });
            },
        )).subscribe(summary => this.refreshSP(summary as any));

        this.disposables.push(s1);

        // Get initial data
        this.spService.getSPSummary().subscribe(summary => {
            this.refreshData(summary as any);
            this.calcAccess();

            this.fg.controls.dropdownSP.setValue('RECENTLY_MODIFIED');

            this.cdr.detectChanges();
        });

        this.checkPrivacyPolicy();
    }

    ngOnDestroy() {
        this.disposables.forEach(s => s.unsubscribe());
        this.spService.recentlyModifiedSPCacheData = {};
        this.spService.recentlyViewedSPCacheData = {};
        this.subs.forEach((sub) => sub.unsubscribe());
    }

    callSearchMetadata(){  
        const cachedPermissions = JSON.parse(this.storageService.getItem('metaDataPMFilter', KfStoreTypeEnum.SESSION));
        if(cachedPermissions === null ){ 
            this.spSearchMetadata().then((observable) => observable.subscribe((res: KfFilterMetadata[]) => {
                this.storageService.setItem('metaDataPMFilter', JSON.stringify(res[0]), KfStoreTypeEnum.SESSION);
            }));}   
    }
    async spSearchMetadata(check?: any): Promise<Observable<KfFilterMetadata[]>> {
        const url = `${this.talentArchitectConstants.getSuccessprofilesBaseUrl()}/?outputType=METADATA&type=CAREER_ARCHITECTURE_VIEW`;
            return new Observable<KfFilterMetadata[]>(observer => {
                this.authService.authHttpCallv2('GET', url, null, { requestType: 'hidden' }).subscribe((data) => {
                    observer.next(data.metadata);
                    observer.complete();
                }, (error) => {
                    observer.error(error);
                });
            });
    }
    navigateSearch(search: string) {
        this.router.navigate(['/tarc/sp/search'], { queryParams: { search } });
    }

    get userLocale(): string {
        const sessionInfo = this.authService.getSessionInfo();
        return sessionInfo && sessionInfo.User ? sessionInfo.User.Locale : 'en';
    }

    formatDate(ms: number) {
        let userLocale = this.userLocale;
        if (userLocale === 'zh') {
            userLocale += '-cn';
        }
        let formatType = 'MMM DD, YYYY';
        dayjs.locale(userLocale);
        if (userLocale !== 'en') {
            formatType = 'DD MMM, YYYY';
        }
        return dayjs(ms).format(formatType);
    }

    download(event: MouseEvent, id: number, reportType: string, url: string, title: string) {
        if (callBulkRunner(event, 'success_profile_single_pdf_export', this.authService.getSessionInfo())) {
            this.spSharedService.downloadSuccessProfileReport(id, reportType, {
                isProfileManager: true,
                excludeSections: [4],
                locale: this.userLocale,
                exportName: reportType === 'SUCCESS_PROFILE'
                    ? `Success Profile - ${title}`
                    : `Job Description - ${title}`,
            } as KfISuccessProfileDownloadOptions);
        } else {
            const fullUrl = `${url}&excludeSections=4&locale=${this.userLocale}`;
            const type = reportType === 'SUCCESS_PROFILE' ? fileReportType.PM_SP_DESCRIPTION : fileReportType.PM_JOB_DESCRIPTION;
            this.spSharedService.downloadReportWithAudit(fullUrl, title, 'PDF', type);
        }
    }

    private refreshFilterData(summary: KfTarcSummary, type: 'sp' | 'jd') {
        if (type === 'sp') {
            this.refreshSP(summary);
        } else if (type === 'jd') {
            this.refreshJD(summary);
        }
    }

    private saveSummaryCacheData(summary) {
        if (this.recentlyFiltered === 'RECENTLY_VIEWED') {
            this.spService.recentlyViewedSPCacheData = summary;
        } else if (this.recentlyFiltered === 'RECENTLY_MODIFIED') {
            this.spService.recentlyModifiedSPCacheData = summary;
        }
    }

    private refreshData(summary: KfTarcSummary) {
        this.functionNames = map(
            summary.functions,
            f => f.id === 'OTHER' ? this.translate.instant('pm.otherText') : f.name,
        );
        this.functionValues = map(summary.functions, 'value');
        this.functionHeight = this.functionValues.length * 32;
        const levels = get(summary, 'level.levels');
        this.donutData = map(levels, lvl => ({ color: this.donutColorMap[lvl.id], ...lvl }));

        this.refreshSP(summary);
        this.refreshJD(summary);

        this.downloads = summary.downloads || [];
        if (this.downloads.length !== 0) {
            this.downloads.length = 6;
        }
    }

    private refreshSP(summary: KfTarcSummary) {
        this.saveSummaryCacheData(summary);
        const jobs = get(summary, 'successProfiles.jobs');
        this.profiles = take(jobs, 3);
        this.profileCount = get(summary, 'successProfiles.totalResultRecords', 0);
    }

    private refreshJD(summary: KfTarcSummary) {
        const jobs = get(summary, 'jobdescriptions.jobs');
        this.jobs = take(jobs, 4);
        this.jobCount = get(summary, 'jobdescriptions.totalResultRecords', 0);
    }

    private calcAccess() {
        const session = this.authService.getSessionInfo();
        const products = session.ClientSubscriptions || [] as any[];
        const prodNames = [];
        for (const product of products) {
            // conversion to user access format...
            const info = this.utils.getProductInfo({ id: parseInt(product.featureId, 10), access: true });
            if (info != null) {
                prodNames.push(info.shortName);
            }
        }
        this.hasCLM = session.User.HasAccessToCLM;
        this.advList = difference(this.advList, prodNames);
    }

    private checkPrivacyPolicy() {
        // Check cache first
        const cachedResponse = this.storageService.getItem('privacyPolicyChecked');
        if (cachedResponse) {
            try {
                const parsedResponse = JSON.parse(cachedResponse);
                if (parsedResponse.error && parsedResponse.error.text && !parsedResponse.error.text.includes('TRUE')) {
                    this.isPrivacyPolicyOpen = true;
                }
                return; // Exit if we have a valid cached response
            } catch (e) {
                console.error('Error parsing cached privacy policy response:', e);
                // Continue to API call if cache parsing fails
            }
        }

        // Only make API call if no valid cached response
        this.authService.getPrivacyPolicy().subscribe(
            (response) => {
                if (response.error && response.error.text && !response.error.text.includes('TRUE')) {
                    this.isPrivacyPolicyOpen = true;
                }
                this.storageService.setItem('privacyPolicyChecked', JSON.stringify(response));
            },
            (error) => {
                if (error.error && error.error.text && !error.error.text.includes('TRUE')) {
                    this.isPrivacyPolicyOpen = true;
                }
                this.storageService.setItem('privacyPolicyChecked', JSON.stringify(error));
            },
        );
    }

    public confirmPrivacyPolicy() {
        this.authService.confirmPrivacyPolicy().subscribe((res) => {
            this.isPrivacyPolicyOpen = false;
        });
    }

    public rejectPrivacyPolicy() {
        this.authService.removeSessionInfo().subscribe(() => {
            this.router.navigate(['login']);
        });
    }

    public viewJobDescription(id) {
        this.router.navigate([`tarc/jd/detail/${id}`]);
    }

    hover(event) {
        if (event?.srcElement) {
            const element = event.srcElement;
            this.hideTooltip = element.offsetHeight >= element.scrollHeight;
        }
    }
}
