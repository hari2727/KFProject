import { Observable, ConnectableObservable, Subject, forkJoin, of, Subscription, Observer } from 'rxjs';
import { publishReplay, debounceTime, takeUntil, filter } from 'rxjs/operators';
import { AfterViewInit, Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import * as Highcharts from 'highcharts';
import { KfThclSuccessprofileService, KfThclSpCompetencyDetailComponent, KfThclCustomGradeService, KfThclSPSharedService, KfThclPointRestrictionService, KfThclSPPricingService, KfThclSpCompareBucketService, KfThclSpMarketInsightsService, KfThclSpJobFactorsService, LoadStatusEnum, KFProductSourceIdsEnum, KfUAMPermissions, KfUCPData, KFUcpCollabEditEnum, KFCopiedSP, fileReportType, KfIJobPropEvent } from '@kf-products-core/kfhub_thcl_lib';
import { KfAuthService, KfChartStyle, KfChartStyleBuilder, KfDropdownService, KfGrowlMessageEventType, KfGrowlMessageType, KfGrowlService, KfICountry, KfIDescription, KfIGrowlMessage, KfIGrowlMessageEvent, KfIJobFactor, KfISpCategory, KfISpSection, KfISpSkill, KfISpSource, KfISpSubCategory, KfISpTasks, KfISpTechnologyCommodity, KfISpToolsCommodity, KfISuccessProfile, KfNavigationUtil, KfSharedConstantsService, KfStorageService, KfLoadingControllerService, KfTranslationService, KfFixedFooterPositionDirective, KfIMarketInsightConfig, KfConfigService, KfIMarketInsightsResults, KfBannerService, KfBanner, KfILang, KfStoreTypeEnum, environment, KfIProjectBundle, KFIProfileCollectionDropdown } from '@kf-products-core/kfhub_lib';
import { KfTarcProfileVersion } from '../../../../models/kftarc-profile-version.model';
import { TranslateService } from '@ngx-translate/core';
import _ from 'lodash';
import { KfTarcSpLearnDevService, KfTarcICourseInfo } from '../../../../services/kftarc-sp-learn-dev.service';
import { KfTarcSuccessProfileDetailService, KfTarcSPViewOptions } from './kftarc-custom-success-profile-detail.service';
import * as Exporting from 'highcharts/modules/treemap';
import { KfTarcSPTiles } from '../../../micro/kftarc-sp-tiles/kftarc-sp-tiles.component';
import { Message } from 'primeng/api';
import { getSMCXSurveyScopes } from '@kf-products-core/kfhub_lib/tracking';
import { KfCategoryNode, KfSubCategoryNode, MAX_COMPETENCIES, SkillsBarChartWidth, TREE_MAP_COLOR_PALETTE, KfEditSuccessProfileOptionsEnum, KfSuccessProfileStatus, KFUcpCollabStatusEnum } from './kftarc-custom-sp-detail.interface';
import { CogAbilityTypeEnum, SpTypeEnum, displayProfileCollections, isExecLevelProfile, isExecutiveUngraded, renderGrade } from '@kf-products-core/kfhub_thcl_lib/domain';
import { KfProduct, KfIUserPermissions } from '@kf-products-core/kfhub_lib/auth';
import { findSelectedLocale } from './kftarc-custom-sp-detail.pure';
import { AppState } from '../../../../../core/core.state';
import { Store, select } from '@ngrx/store';
import { actionLocaleQuery } from '../../../../../core/effects/core.actions';
import { selectLocale } from '../../../../../core/effects/core.selectors';
import { KfISuccessProfileDownloadOptions } from '@kf-products-core/kfhub_thcl_lib/_deprecated/models/kfthcl-i-download-options.model';
import { ProductTypeEnum } from '../../../../../../pages/sp-search/sp-search.constant';

Exporting(Highcharts);

const displayedAmountByView = {
    technical: {
        default: 3,
        select: 3,
        pay: 6,
        recruit: 5,
    },
    behavioral: {
        default: 3,
        select: 3,
        pay: 0,
        recruit: 0,
    },
    technology: {
        default: 3,
        select: 0,
        pay: 5,
        recruit: 5,
    },
    tool: {
        default: 3,
        select: 0,
        pay: 0,
        recruit: 0,
    },
};
const CN_PROD = 'cn-prod';

@Component({
    selector: 'kftarc-custom-spdetail',
    templateUrl: './kftarc-custom-sp-detail.component.html',
    styleUrls: ['./kftarc-custom-sp-detail.component.scss'],
    providers: [DecimalPipe],
})
export class KfTarcCustomSPDetailComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(KfThclSpCompetencyDetailComponent) detailComponent;
    @ViewChild('profileMatchTool') profileMatchTool;
    @ViewChild('responsibilityChart') responsibilityChart;
    @ViewChild('skillsTechsWrapper', { static: true, read: ElementRef }) skillsTechsWrapper: ElementRef;
    @ViewChild(KfFixedFooterPositionDirective) footerPositionDir: KfFixedFooterPositionDirective;

    readonly surveyScope = getSMCXSurveyScopes().ProfileManager;

    successProfile: KfISuccessProfile;
    marketInsights: KfIMarketInsightsResults;
    assessmentRequirements: any = null;

    bannerFactName: string;
    bannerFactDetail: string;
    marketInsightConfig: KfIMarketInsightConfig = null;

    altTitles?: string[] = [];
    altTitlesString: string;

    isSliderOpen = false;
    isEditMode = false;
    showActionMenu = false;
    truncateFrom = 145;
    hideTooltip = true;
    showSelectMenu = false;
    viewType = '';
    defaultTab = 'driversCompetencies';
    showRemoveModal: boolean;
    showRemoveMenuItem: boolean;
    showEditMenuItem: boolean;
    showCopyMenuItem: boolean;

    isLearningDevelopOpen = false;
    learningContent: KfTarcICourseInfo[] = [];

    isSpPdfDownloadOpened = false;

    isIGEmptyModalOpen = false;
    isIGConfigModalOpen = false;
    isAssessmentModal = false;
    productInputsForm = this.formBuilder.group({
        product: '',
    });
    productTypes: KfIProjectBundle[];
    assessmentModalTabSelected = 0;
    isAssessNextBtnDisabled = true;

    isCopyModalOpen = false;
    isCopyTextAdded = false;
    copySPTitle = '';
    jobTitle = '';
    copySP = null;

    permissions: KfIUserPermissions;

    selectedCountry: KfICountry;
    countryArray: KfICountry[];

    relatedSuccessProfiles: any[] = [];
    userCompanyName: string;
    jobFactors: KfIJobFactor[];
    showMatchTool = false;
    isOwnerUser = false;
    isEditable = false;
    normId: number;
    normLabel: string;
    levelMappings: KfISuccessProfile['kfLevelMappings'];
    topTechnicalSkills: any;
    topBehavioralSkills: any;
    topTechnicalSkillsCount = 0;
    topSkillsWidth: number = SkillsBarChartWidth.default;
    topTechnicalSkillsHeight: number;
    topBehavioralSkillsCount = 0;
    topBehavioralSkillsHeight: number;
    topTraits: any;
    topTechTilesData: KfTarcSPTiles;
    topToolTilesData: KfTarcSPTiles;
    topTechSkillsData: KfTarcSPTiles;
    topResponsibilityCategories: KfCategoryNode[] = [];
    topResponsibilitySubCategories: KfSubCategoryNode[] = [];
    responsibilities: KfISpSubCategory[];
    unflattenedResponsibilities: KfISpCategory[];
    tasks: KfISpTasks[];
    topTasks: KfISpTasks[];

    behavioralCompetencies: KfIDescription[];
    behavioralCompetenciesCodes: string[];
    technicalCompetencies: KfIDescription[];
    dependentTechSkills: KfISpSkill[] = [];
    techSkillsTotal = 0;
    technologies: KfISpTechnologyCommodity[];
    tools: KfISpToolsCommodity[];
    education: KfIDescription;
    generalExperience: KfIDescription;
    managerialExperience: KfIDescription;
    traits: KfIDescription[];

    responsibilityTreeMap: any;
    responsibilityTreeMapData = [];
    driversHexData = {
        data: [],
    };
    maxScore = 11;
    cognitiveAbilitiesData: any = [];

    hasGradeAccess = false;

    arch: 'select' | 'view' | '' = '';
    isCreateJobModal = false;
    jobCode = '';
    selectedProfile: any;
    canCreateAssessmentProject: boolean;
    invalidJobCode = false;

    jobCodeChange$ = new Subject<string>();

    barStyleSoft = new KfChartStyleBuilder()
        .for(KfChartStyle.bar, () => ({ fill: '#3acdd2', size: 6 }));

    benchmarkStyle = new KfChartStyleBuilder()
        .for(KfChartStyle.benchmark, () => ({ mode: 'continuous', fill: '#ebeff2' }))
        .for(KfChartStyle.line, () => ({ stroke: '#ebeff2', strokeWidth: 2 }));

    hexStyle = new KfChartStyleBuilder()
        .for(KfChartStyle.polyline, (_1, i) => {
            const stroke = i + 1 < this.maxScore ? '#919191' : '#fff';
            const strokeDasharray = i + 1 < this.maxScore - 1 ? '2' : '0';
            return { stroke, strokeDasharray, strokeWidth: 0.5, fill: 'none' };
        })
        .for(KfChartStyle.polygon, () => ({ fill: '#cedc46', opacity: 0.2 }))
        .for(KfChartStyle.circle, () => ({ fill: '#566ed5', radius: 2.5 }))
        .for(KfChartStyle.label, () => ({ fontSize: 10 }))
        .for(KfChartStyle.line, () => ({ stroke: '#919191', strokeWidth: 0.5 }));

    showExecGrading = false;
    message: boolean;
    cogAspectsElements: string[];


    showJobPricing: boolean;
    orgName: string;
    showKfGradeIcon: boolean;
    userProducts: KfProduct[] = [];
    assessmentSelectedIndex = 0;
    hasActionItemsReady = false;
    hasAssessmentProducts = false;
    public hasCustomGradesAccess = false;
    selectViewOptions: KfTarcSPViewOptions;
    showBanner = false;
    currentURL = '';
    showEditPopUp = false;
    collabEdit = false;
    public editCollaborativeAccess = true;
    public showEditManageStakeholders = false;
    public showJobDescription = true;
    public ownerObject = {};
    private collabData: KfUCPData;
    private userPermissionsByEmail: KfUAMPermissions;

    currentApp = 'tarc';

    private destroy$ = new Subject();
    private regionalNorms$: ConnectableObservable<any>;
    public isExecutiveUngradedProfile = false;
    public renderGrade = renderGrade;
    public kfLabel = this.translate.instant('lib.kornFerry');

    private banners: KfBanner[] = this.bannersService.getBanners();

    private utilityBannerShown = Number(this.storageService.getItem('showBanner') === 'true');

    public get totalBanners() {
        return this.banners.length + this.utilityBannerShown;
    }

    public isShadowMode = !!this.storageService.getItem(this.sharedConstants.SHADOW_CLIENT_KEY);

    public isNavigateToEdit = false;

    public languages: KfILang[] = [];

    public selectedLanguage: KfILang;

    private subscriptions$: Subscription[] = [];

    public hasLanguageAccess = false;

    public languagesAreMatching = true;

    public userLocale = 'en';

    public navigateAwaySelection$: Subject<boolean> = new Subject<boolean>();
    public isIcClientUser = false;
    public skillCardTitle = '';
    public toolsAndTechnoCardTitle = '';

    public spTypeEnum = SpTypeEnum;

    public customAssessmentsEnabled = false;

    public displayCustomCogAbilities = false;

    public displayProfileCollections = displayProfileCollections;

    public clientProfileCollections: KFIProfileCollectionDropdown[] = [];

    public selectedProfileCollections: number[] = [];

    constructor(
        public spDetailsService: KfTarcSuccessProfileDetailService,
        public successProfileService: KfThclSuccessprofileService,
        private activatedRoute: ActivatedRoute,
        private authService: KfAuthService,
        private bucketService: KfThclSpCompareBucketService,
        private dropdownService: KfDropdownService,
        private cd: ChangeDetectorRef,
        private configService: KfConfigService,
        private customGradeService: KfThclCustomGradeService,
        private formBuilder: UntypedFormBuilder,
        private growlService: KfGrowlService,
        private jobFactorsDataService: KfThclSpJobFactorsService,
        private learnDevService: KfTarcSpLearnDevService,
        private loadingService: KfLoadingControllerService,
        private marketInsightsDataService: KfThclSpMarketInsightsService,
        private pointRestrictionService: KfThclPointRestrictionService,
        private pricingService: KfThclSPPricingService,
        private router: Router,
        private sharedConstantsService: KfSharedConstantsService,
        private spSharedService: KfThclSPSharedService,
        private storageService: KfStorageService,
        private translate: TranslateService,
        private translationService: KfTranslationService,
        private bannersService: KfBannerService,
        private sharedConstants: KfSharedConstantsService,
        public store: Store<AppState>,
    ) {
        this.selectViewOptions = this.spDetailsService.selectViewOptions;
        this.currentURL = window.location.href;

        this.userLocale = this.authService.getSessionInfo().User ? this.authService.getSessionInfo().User.Locale : 'en';

        this.authService.getConfig().subscribe((res: any) => {
            if (res) {
                this.languages = res.phlanguages;

                const localeFromFilter = this.spDetailsService.getLocaleFromFilter();

                this.selectedLanguage = localeFromFilter ? findSelectedLocale(localeFromFilter, this.languages) : findSelectedLocale(this.userLocale, this.languages);
            }
        });
        if (this.storageService.getItem('_isIcClient')) {
            this.isIcClientUser = JSON.parse(this.storageService.getItem('_isIcClient'));
        }
    }

    async ngOnInit() {
        this.permissions = this.authService.getPermissions();

        this.hasLanguageAccess = this.permissions.hasLanguageAccess;

        if (this.storageService.getItem('hasCustomCogAbilitiesSubscription')) {
            this.customAssessmentsEnabled = JSON.parse(this.storageService.getItem('hasCustomCogAbilitiesSubscription'));
        }

        this.subscriptions$.push(
            this.bannersService.banners.subscribe(banners => {
                this.banners = banners;
            }),
            this.authService.getSpContentUpdateSub().subscribe((res) => {
                this.utilityBannerShown = Number(res?.showBanner || false);
            })
        );

        this.configService.currentMessage.subscribe(message => this.message = message);
        this.initProductForm();
        this.activatedRoute.data
            .subscribe((spData: Data) => {
                if (!this.checkPermissions(spData.spData)) {
                    this.redirectToSearch();
                } else {
                    this.initializeSuccessProfile(spData.spData);
                }
            });

        if (this.hasLanguageAccess) {
            const localeStateSub = this.store.pipe(
                select(selectLocale),
                filter((localeState) => localeState.loadStatus === LoadStatusEnum.LOADED),
            ).subscribe((localeState) => {
                if (this.userLocale &&
                localeState.locale && localeState.locale === this.userLocale) {
                    this.navigateAwaySelection$.next(true);
                }
            });
        }
        this.clientProfileCollections = (await this.successProfileService.getClientProfileCollections().toPromise())
            .map(({ profileCollectionsName, profileCollectionId, ...collection }) => (
                {
                    ...collection,
                    name: profileCollectionsName,
                    id: profileCollectionId,
                }));
    }

    ngAfterViewInit() {
        this.drawResponsibilityTreeMap();
    }

    async initializeSuccessProfile(data: KfISuccessProfile) {
        if (data == null) {
            throw new Error('No SP data');
        }

        if (this.successProfile && !this.successProfile.jobCode) {
            this.successProfile.jobCode = '';
        }

        this.getSelectedView();
        this.clearData();

        this.successProfile = data;
        if (this.successProfile?.hideJobInPM === 1) {
            this.redirectToSearch();
        }

        // Temporary checking that custom assessments based on length of assessments array (waiting for SP-12864 to be implemented)
        this.customAssessmentsEnabled = this.successProfile.assessments.length > 3;

        this.populateProfileState();

        const params = this.activatedRoute.snapshot.queryParams;
        this.arch = params.arch || '';

        this.countryArray = await this.getCountriesList();
        this.selectedCountry = this.getSelectedCountry();
        this.dropdownService.setValue(this.selectedCountry.name);
        this.onReloadPriceResult(this.successProfile);
        this.marketInsights = await this.getMarketInsights();

        const sessionInfo = this.authService.getSessionInfo();
        this.userProducts = sessionInfo.User.Products;
        this.canCreateAssessmentProject = false;
        this.productTypes = [];
        this.hasAssessmentProducts = !!_.find(
            this.userProducts,
            (prod) => prod.productId === this.sharedConstantsService.PRODUCT_TAMG.productId ||
                prod.productId === this.sharedConstantsService.PRODUCT_TACQ.productId);

        this.getRegionalNorms().pipe(takeUntil(this.destroy$)).subscribe((res) => {
            const regionalNorms = res.data.regionalNorms;
            const regionalNormLocations = res.data.regionalNormLocations;
            this.successProfileService.cacheRegionalNorms(regionalNorms, regionalNormLocations);
            const normRef = this.successProfileService.getNorm(this.normId);
            this.normLabel = normRef?.normLabel ? normRef.normLabel : '';
        });

        this.initializeOnetData();

        this.successProfileService.getProfileVersion(this.successProfile.id, 'background')
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: KfTarcProfileVersion[]) => {
                if (response) {
                    response.sort((a: KfTarcProfileVersion, b: KfTarcProfileVersion) => a.order > b.order ? 1 : b.order > a.order ? -1 : 0);
                    if (this.successProfile.parentJobDetails && parseFloat(this.successProfile.parentJobDetails.version) < parseFloat(response[response.length - 1].version)) {
                        this.showNewerVersionToast();
                        this.growlService.open()
                            .pipe(takeUntil(this.destroy$))
                            .subscribe((messageEvent: KfIGrowlMessageEvent) => {
                                const message: Message = messageEvent.message;
                                if (message?.data?.growlMessage) {
                                    const growlMessage: KfIGrowlMessage = message.data.growlMessage;
                                    switch (messageEvent.messageEventType) {
                                        case KfGrowlMessageEventType.INTERACTION: {
                                            const newestJobId = response[response.length - 1].jobId;
                                            this.navigateToSuccessProfile(newestJobId);
                                            break;
                                        }
                                        case KfGrowlMessageEventType.CLOSE:
                                            this.growlService.removeInteractiveMessage(growlMessage);
                                            break;
                                    }
                                }
                            });
                    }
                }
            });

        if (this.isExecutiveGraded && this.successProfile.orgId) {
            this.getCompanyNameForExecGradedProfile();
        } else {
            this.orgName = null;
        }

        if (this.successProfile?.status === KfSuccessProfileStatus.collabEdit && !this.isIcClientUser) {
            setTimeout(() => this.interactiveSuccessMessageEditMode(), 1000 );
        }

        this.hasCustomGradesAccess = this.permissions.hasCustomGrades;

        this.showKfGradeIcon = this.hasCustomGradesAccess && this.successProfile.grade && !this.successProfile.grade.customGrades &&
        !isExecLevelProfile(+this.successProfile.standardHayGrade);

        this.languagesAreMatching = this.langsAreMatching();

        this.isExecutiveUngradedProfile = isExecutiveUngraded(this.successProfile);

        if (this.isExecutiveUngradedProfile) {
            this.successProfileService.hasGradedParent('background')
                .pipe(takeUntil(this.destroy$))
                .subscribe((enableGrading) => {
                    this.permissions.hasExecutiveGradingAccess = this.permissions.hasExecutiveGradingAccess && enableGrading;
                });
        }

        if (this.arch !== 'select') {
            this.learnDevService.getLearnDev(this.successProfile.id, 'background')
                .pipe(takeUntil(this.destroy$))
                .subscribe(({ learningContent }) => {
                    this.learningContent = learningContent;
                });
        }

        this.jobCodeChange$.pipe(debounceTime(400), takeUntil(this.destroy$))
            .subscribe((value: string) => {
                this.checkJobCodeValidity(value);
            });
        this.generateSkillCardTitle();
        this.generateToolsAndTechnoCardTitle();
    }

    initializeActionItems() {
        if (this.hasActionItemsReady) {
            return;
        }
        const loaders: Observable<any>[] = [];

        if (this.hasAssessmentProducts) {
            loaders.push(this.successProfileService.getAssessmentProducts(this.successProfile.id));
        } else {
            loaders.push(of(null));
        }

        if (!this.isLevel) {
            loaders.push(this.spSharedService.getSingleJobPricingAccess());
        } else {
            loaders.push(of(false));
        }

        forkJoin(loaders)
            .pipe(takeUntil(this.destroy$))
            .subscribe(([res, hasJobPricingAccess]: [any | null, boolean]) => {
                if (res?.productTypes) {
                    const userProductIds = this.userProducts.map(p => p.productId);
                    const productTypes = res.productTypes.filter(pt => userProductIds.indexOf(pt.id) > -1);
                    this.productTypes.push(...productTypes);

                    this.checkPermissionAndRemoveProductType('hasCreateAssessProject', this.productTypes, ProductTypeEnum.Assess);

                    this.checkPermissionAndRemoveProductType('hasCreateSelectProject', this.productTypes, ProductTypeEnum.Select);

                    if (!this.collabData || this.collabData?.data && !this.collabData.data.collabIdAvailable) {
                        this.canCreateAssessmentProject = !!this.productTypes.length;
                    }
                }
                this.showJobPricing = !!hasJobPricingAccess;
                this.hasActionItemsReady = true;
            });
    }

    public getCompanyNameForExecGradedProfile(): void {
        this.spSharedService.getOrgData(this.successProfile.orgId, 'background')
            .pipe(takeUntil(this.destroy$))
            .subscribe((orgData: any) => {
                if ('questionSets' in orgData) {
                    const foundQuestionSet = orgData.questionSets.find(questionSet =>
                        questionSet.id === 1000 || questionSet.id === 5000);
                    if (foundQuestionSet?.questions?.length) {
                        for (const question of foundQuestionSet.questions) {
                            if (question?.choice?.value) {
                                this.orgName = question.choice.value;
                                break;
                            }
                        }
                    }
                }
            });
    }

    populateProfileState(): void {
        this.hasGradeAccess = this.successProfile.hasGradeAccess;
        this.normId = this.successProfile.regionalNormData.normId;
        this.isOwnerUser = this.evaluateIfOwnerUser();
        this.isEditable = this.isOwnerUser;
        this.copySP = _.cloneDeep(this.successProfile);
        this.showRemoveMenuItem = this.showOrHideRemoveMenuItem();
        this.showEditMenuItem = this.showOrHideEditMenuItem();
        this.showCopyMenuItem = this.showOrHideCopyMenuItem();
        this.showJobDescription = !this.isIcClientUser;
        this.populateTopSections(this.successProfile);
        this.successProfileService.backupSuccessProfile(this.successProfile);
        this.copySPTitle = this.successProfile.title;
        this.jobTitle = this.successProfile.title;
        this.isCopyTextAdded = false;
        this.levelMappings = this.successProfile.kfLevelMappings;
        this.altTitles = [];
        this.altTitlesString = '';
    }

    initializeOnetData() {
        if (this.isOnet) {
            const sub1 = this.authService.getRelatedProfiles(this.successProfile.parentJobDetails.id, 'background')
                .pipe(takeUntil(this.destroy$))
                .subscribe((profiles) => {
                    this.getFirstTwoRelatedSuccessProfiles(profiles.jobs);
                });

            this.subscriptions$.push(sub1);
        }
    }

    clearData() {
        this.hasActionItemsReady = false;
        this.clearTopData();
        this.removeSubscriptions();
        this.driversHexData.data = [];
        this.growlService.clearInteractiveMessages();
        this.successProfileService.resetUpdatedNorm();
    }

    public drawResponsibilityTreeMap(): void {
        if (this.responsibilityChart?.nativeElement) {
            setTimeout(
                () => {
                    if (this.responsibilityTreeMap) {
                        this.responsibilityTreeMap.destroy();
                    }
                    this.responsibilityTreeMap = Highcharts.chart({
                        chart: {
                            renderTo: this.responsibilityChart.nativeElement,
                            height: 250,
                            width: 362,
                        },
                        credits: { enabled: false },
                        tooltip: { enabled: false },
                        title: { text: '' },
                        series: [{
                            type: 'treemap',
                            layoutAlgorithm: 'squarified',
                            dataLabels: {
                                align: 'left',
                                verticalAlign: 'top',
                                style: {
                                    color: 'white',
                                    textOutline: 0,
                                },
                            },
                            data: this.responsibilityTreeMapData,
                        } as any],
                    });
                },
                0,
            );
        }
    }

    showNewerVersionToast(): void {
        this.translate.get('pm.newVersion')
            .subscribe((text: string) => {
                this.growlService.createInteractiveWarningMessage(
                    text, '', KfGrowlMessageType.PROFILEVERSIONS, null, 0,
                );
            });
    }

    interactiveSuccessMessageEditMode(): void {
        const message = `${this.translationService.get('pm.editProfileToastMessage')}`;
        this.growlService.createInteractiveSuccessMessage(message, '', null, KfGrowlMessageType.SUCCESS, 5000);
    }

    cacheAssessmentSettings(): void {
        const data = _.cloneDeep(this.successProfile.traitsAndDrivers);
        this.assessmentRequirements = {};
        this.assessmentRequirements.driversCultureRankings = data.driverCultureRankings;
        this.assessmentRequirements.roleRequirementQuestions = data.roleRequirementsQuestions;
        this.successProfileService.setLastAssessmentRequirements(this.assessmentRequirements);
    }

    getFirstTwoRelatedSuccessProfiles(profiles: KfISuccessProfile[]): void {
        this.relatedSuccessProfiles = [];
        for (const profile of profiles) {
            if (+profile.id !== this.successProfile.id && profile.profileType !== SpTypeEnum.Custom) {
                this.relatedSuccessProfiles.push(profile);
            }
            if (this.relatedSuccessProfiles?.length === 2) {
                return;
            }
        }
    }

    getIcon(relatedSuccessProfile: KfISuccessProfile): string {
        let icon = '';
        switch (relatedSuccessProfile.profileType) {
            case SpTypeEnum.Levels:
                icon = 'profile-level';
                break;
            case SpTypeEnum.BestInClass:
                icon = 'profile-function';
                break;
            case SpTypeEnum.ONet:
                icon = 'profile-task';
                break;
            case SpTypeEnum.Custom:
                icon = 'custom';
                break;
            case SpTypeEnum.Ai:
                icon = 'ai-powered';
                break;
        }
        return icon;
    }

    get isOnet(): boolean {
        return this.successProfile.profileType === SpTypeEnum.ONet;
    }

    get isLevel(): boolean {
        return this.successProfile.profileType === SpTypeEnum.Levels;
    }

    get isFunction(): boolean {
        return this.successProfile.profileType === SpTypeEnum.BestInClass;
    }

    isEntryLevel(): boolean {
        if (this.successProfile) {
            const level = this.successProfile.kfLevelMappings.level.globalCode;
            if (level === 'Lvl_06_04' || level === 'Lvl_06_05' || level === 'Lvl_06_06') {
                return true;
            }
        }
        return false;
    }

    isGraduateProfessionalManagerialLevel(): boolean {
        if (this.successProfile) {
            const level = this.successProfile.kfLevelMappings.level.globalCode;
            if (level === 'Lvl_04_01'
                || level === 'Lvl_04_02'
                || level === 'Lvl_05_01'
                || level === 'Lvl_05_02'
                || level === 'Lvl_06_01'
                || level === 'Lvl_06_02'
                || level === 'Lvl_06_03') {
                return true;
            }
        }
        return false;
    }

    isExecutiveLevel(): boolean {
        if (this.successProfile) {
            const level = this.successProfile.kfLevelMappings.level.globalCode;
            if (level === 'Lvl_01_01'
                || level === 'Lvl_02_01'
                || level === 'Lvl_02_02'
                || level === 'Lvl_03_01'
                || level === 'Lvl_03_02') {
                return true;
            }
        }
        return false;
    }

    get isExecutiveGraded(): boolean {
        return this.successProfile.isExecutive
            && Object.prototype.hasOwnProperty.call(this.successProfile, 'grade')
            && !Object.prototype.hasOwnProperty.call(this.successProfile.grade, 'min')
            && !Object.prototype.hasOwnProperty.call(this.successProfile.grade, 'max');
    }

    public get hasToolsTechCard() {
        const hasTopTechSkills = _.get(this.topTechSkillsData, 'topElements.length');
        const hasTopTools = _.get(this.topToolTilesData, 'topElements.length');
        if (this.isIcClientUser) {
            return this.viewType === '' && hasTopTools ||
            (this.viewType === this.selectViewOptions.recruit || this.viewType === this.selectViewOptions.pay) && hasTopTools;
        } else {
            return this.viewType === '' && (hasTopTechSkills || hasTopTools) ||
            (this.viewType === this.selectViewOptions.recruit || this.viewType === this.selectViewOptions.pay) &&
            hasTopTechSkills;
        }
    }

    private setSkillsTechsWrapperClass(): void {
        switch (this.viewType) {
            case this.selectViewOptions.select:
            default:
                this.skillsTechsWrapper.nativeElement.classList.add('vertical');
                break;
            case this.selectViewOptions.pay:
            case this.selectViewOptions.recruit:
                if (!this.hasToolsTechCard) {
                    this.skillsTechsWrapper.nativeElement.classList.remove('vertical');
                } else {
                    this.skillsTechsWrapper.nativeElement.classList.add('vertical');
                }
        }
    }

    getSelectedView(): void {
        const type = this.storageService.getItem('selectedView');
        if (type) {
            this.viewType = type;
            this.setSkillsTechsWrapperClass();
        }
    }

    getSelectMenuText(): string {
        let text = '';
        switch (this.viewType) {
            case this.selectViewOptions.select:
                text = 'pm.selectView';
                break;
            case this.selectViewOptions.recruit:
                text = 'pm.recruitView';
                break;
            case this.selectViewOptions.pay:
                text = 'pm.payView';
                break;
            default:
                text = 'pm.general';
                return this.translate.instant(text);
        }

        return this.translate.instant(text);
    }

    switchToView(view: string): void {
        this.toggleSelectMenu();
        this.viewType = view;
        this.addSelectedViewToLocalStorage();
        this.updateTopData();
        this.setSkillsTechsWrapperClass();
    }

    clearSelection(): void {
        this.toggleSelectMenu();
        this.viewType = '';
        this.storageService.removeItem('selectedView');
        this.updateTopData();
        this.setSkillsTechsWrapperClass();
    }

    addSelectedViewToLocalStorage(): void {
        this.storageService.setItem('selectedView', this.viewType);
    }

    navigateToSuccessProfile(id): void {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        if (this.collabEdit) {
            const originURL = this.getOriginUrl();
            window.open(`${originURL}/app/ucp/#/user/edit-configuration/?spId=${id}&app=${this.currentApp}`, '_self');
        } else {
            this.router.navigate([`tarc/sp/detail/${id}`]);
        }
    }

    navigateToJobPricing(): void {
        if (this.hasLanguageAccess && !this.languagesAreMatching) {
            return;
        }
        KfNavigationUtil.navigateMenu(this.router, '/sjpr', '/pricing-criteria', {
            queryParams: {
                appName: 'SP',
                successprofileid: this.successProfile.id,
            },
        });
    }

    viewAllDetails(): void {
        this.cacheAssessmentSettings();
        this.openSlider('details');
    }

    updateBannerFacts({ bannerFactName, bannerFactDetail }: any): void {
        this.bannerFactName = bannerFactName;
        this.bannerFactDetail = bannerFactDetail;
    }

    removeSuccessProfile(): void {
        if (this.successProfile) {
            this.showRemoveModal = true;
        }
    }

    removeSuccessProfileChoice(choice: boolean): void {
        this.showRemoveModal = false;
        if (choice) {
            this.authService.deleteSuccessProfile(this.successProfile.id).subscribe(() => {
                this.bucketService.removeItem(this.successProfile.id);
                this.router.navigate(['tarc/sp/search']);
            });
        }
    }

    openLearningDevelopment(): void {
        this.isLearningDevelopOpen = true;
    }

    closeLearningDevelopment(): void {
        this.isLearningDevelopOpen = false;
    }

    showOrHideRemoveMenuItem(): boolean {
        if (!this.successProfile.accessRoles || !this.successProfile.profileType) {
            return false;
        }
        return this.successProfile.accessRoles.includes('DELETE') && !this.successProfile.isTemplateJob;
    }

    showOrHideEditMenuItem(): boolean {
        if (!this.successProfile.accessRoles || !this.successProfile.profileType) {
            return false;
        }
        return this.successProfile.accessRoles.includes('EDIT');
    }

    showOrHideCopyMenuItem(): boolean {
        if (!this.successProfile.accessRoles || !this.successProfile.profileType) {
            return false;
        }

        return this.successProfile.accessRoles.includes('COPY');
    }

    onSuccessProfileChange(event: KfISuccessProfile): void {
        this.successProfile = event;
        this.copySP = _.cloneDeep(this.successProfile);
        this.copySPTitle = this.successProfile.title;
        this.jobTitle = this.successProfile.title;
        this.isCopyTextAdded = false;
        this.populateTopSections(this.successProfile);
        this.cacheAssessmentSettings();
    }

    onSuccessProfileSave(event: KfISuccessProfile): void {
        this.successProfile = event;
        this.copySP = _.cloneDeep(this.successProfile);
        this.copySPTitle = this.successProfile.title;
        this.jobTitle = this.successProfile.title;
        this.isCopyTextAdded = false;
        this.populateTopSections(this.successProfile);
        this.cacheAssessmentSettings();
        this.normId = this.successProfile.regionalNormData.normId;
        this.normLabel = this.successProfileService.getNorm(this.normId).normLabel;
    }

    onSavedSP(data?: KfISuccessProfile): void {
        const profileId = data.id ? data.id : this.successProfile.id;
        this.successProfileService.getSuccessProfileDetail(profileId, true, true).subscribe((profile) => {
            this.initializeSuccessProfile(profile);
        });
    }

    populateTopSections(successProfile: KfISuccessProfile): void {
        const sectionCodes = [
            'RESPONSIBILITY',
            'TRAITS',
            'DRIVERS',
        ];

        const topSectionCodes = [
            'TASKS',
            'TOOLS',
            'TECHNOLOGY',
        ];
        const generalExperienceCode = 'GENX';
        const managerialExperienceCode = 'MGRX';
        this.userCompanyName = this.authService.getSessionInfo().Client.Name;
        successProfile.sections.forEach((section: KfISpSection) => {
            if (sectionCodes.indexOf(section.code) >= 0) {
                const subCategories = section.code === 'TRAITS' ?
                    _.filter(section.subCategories, s => s.type === 'C') :
                    section.subCategories || [];
                this[`top${this.convertTypeName(section.code)}`] =
                    subCategories.slice(0, MAX_COMPETENCIES[section.code]);
            }

            if (topSectionCodes.indexOf(section.code) >= 0) {
                if (section.code === 'TASKS') {
                    if (section.tasks) {
                        this[`isTop${this.convertTypeName(section.code)}Enable`] = true;
                    }
                    this[`top${this.convertTypeName(section.code)}`] = this.getSectionToTaskCard(section)
                        .slice(0, MAX_COMPETENCIES[section.code]);
                    this[`top${this.convertTypeName(section.code)}Total`] =
                        section.tasks ? section.tasks.length : 0;
                    this.tasks = section.tasks;
                }
                if (section.code === 'TOOLS') {
                    if (section.toolsCommodities) {
                        this[`isTop${this.convertTypeName(section.code)}Enable`] = true;
                    }
                    this.tools = section.toolsCommodities;
                }
                if (section.code === 'TECHNOLOGY') {
                    if (section.technologyCommodities) {
                        this[`isTop${this.convertTypeName(section.code)}Enable`] = true;
                    }
                    this.technologies = section.technologyCommodities;
                }
            }

            if (section.code === 'RESPONSIBILITY') {
                this.responsibilities = section.subCategories || [];
            }

            if (section.code === 'BEHAVIORAL_SKILLS') {
                this.behavioralCompetencies = section.subCategories || [];
            }

            if (section.code === 'TECHNICAL_SKILLS') {
                const subCategories = section.subCategories || [];
                this.technicalCompetencies = subCategories;
                this.getDependentTechSkills(subCategories);
            }

            if (section.code === 'TRAITS') {
                this.traits = _.filter(section.subCategories, s => s.type !== 'S');
            }

            if (section.code === 'EDUCATION') {
                if (section.subCategories?.length) {
                    this.education = section.subCategories[0].descriptions[0];
                } else {
                    this.education = null;
                }
            }

            if (section.code === 'EXPERIENCE') {
                if (section.subCategories?.length) {
                    const generalExp = section.subCategories.find(sub => sub.globalCode === generalExperienceCode);
                    this.generalExperience = generalExp ? generalExp.descriptions[0] : null;
                    const managerialExp =
                        section.subCategories.find(sub => sub.globalCode === managerialExperienceCode);
                    this.managerialExperience = managerialExp ? managerialExp.descriptions[0] : null;
                } else {
                    this.generalExperience = null;
                    this.managerialExperience = null;
                }
            }
        });

        const unflattenedSP = this.successProfileService.getUnflattenedSuccessProfile();
        if (unflattenedSP) {
            const resps = unflattenedSP.sections.find(s => s.code === 'RESPONSIBILITY');
            if (resps?.categories?.length) {
                this.unflattenedResponsibilities = this.mergeAndSortBySubcategoryCount(resps.categories);
            } else {
                this.unflattenedResponsibilities = [];
            }
        }

        if (this.responsibilities) {
            this.generateRespTreemapData();
        }
        this.generateDriversData();
        this.getCognitiveAbilities();
        this.updateTopData();
    }

    getDependentTechSkills(technicalCompetencies: KfISpSubCategory[]): void {
        this.dependentTechSkills = _.flow([
            (subCategories: KfISpSubCategory[]) => {
                const totalSubCtgs = subCategories.length;
                const arr = [];
                subCategories.forEach((ctgs, i) => !_.isNil(ctgs.dependents)
                    ? ctgs.dependents.forEach((d, j) => arr[j * totalSubCtgs + i] = d)
                    : undefined,
                );
                return arr;
            },
            _.partialRight(_.filter, (skill: KfISpSkill) => !_.isNil(skill) && skill.jobSkillComponentName),
        ])(technicalCompetencies);

        this.techSkillsTotal = this.dependentTechSkills.length;
    }

    getCogAbilitiesType(name) {
        if (name) {
            const data = name.split('_');
            return data[0];
        }
    }

    getCognitiveAbilities(): void {
        if (this.successProfile.cogAbilityType === CogAbilityTypeEnum.PeopleLeader) {
            this.cogAspectsElements = ['elements'];
        } else if (this.successProfile.cogAbilityType === CogAbilityTypeEnum.IndividualAspects) {
            this.cogAspectsElements = ['aspects'];
        } else if (!this.successProfile.cogAbilityType) {
            this.cogAspectsElements = ['elements', 'aspects'];
        }

        // Not filtering out assessments when customizations are enabled
        const cognitiveAbilitiesDataUnsorted = this.customAssessmentsEnabled ?
            this.successProfile.assessments :
            this.successProfile.assessments.filter((res) => {
                const cogAbilitiesType = this.getCogAbilitiesType(res.type);
                return cogAbilitiesType && this.cogAspectsElements.indexOf(cogAbilitiesType.toLowerCase()) > -1;
            });

        if (!this.customAssessmentsEnabled) {
            const assessments = this.successProfile.assessments.map((ele) => ({
                isMandatory: ele.isMandatory,
                id: ele.id,
            }));
            this.successProfileService.backUpCognitiveAssessment(assessments);
        } else if (this.customAssessmentsEnabled) {
            const assessments = this.successProfile.assessments
                .filter(assessment => assessment.isCustom === 0)
                .map((ele) => ({
                    isMandatory: ele.isMandatory,
                    id: ele.id,
                    isCustom: ele.isCustom,
                    isCustomTabSelected: ele.isCustomTabSelected
                }));

            this.successProfileService.backUpCognitiveAssessment(assessments);

            const customAssessments = this.successProfile.assessments
                .filter(assessment => assessment.isCustom === 1)
                .map((ele) => ({
                    isMandatory: ele.isMandatory,
                    id: ele.id,
                    isCustom: ele.isCustom,
                    isCustomTabSelected: ele.isCustomTabSelected,
                    subType: ele.type.split('_')[1]
                }));
            this.successProfileService.backUpCustomCognitiveAssessment(customAssessments);
        }

        this.cognitiveAbilitiesData = _.sortBy(cognitiveAbilitiesDataUnsorted, ability => ability.id);

        if (this.customAssessmentsEnabled) {
            this.displayCustomCogAbilities = !!this.cognitiveAbilitiesData.find(ability => ability.isCustomTabSelected === 1);
            if (this.displayCustomCogAbilities) {
                this.cognitiveAbilitiesData = this.cognitiveAbilitiesData.filter(ability => ability.isCustom && ability.isMandatory);
            } else {
                this.cognitiveAbilitiesData = this.cognitiveAbilitiesData.filter(ability => ability.isCustom === 0);
            }
        }
    }

    public getCogAbilitiesName(name: string): string {
        if (name) {
            const data = name.split(':');
            return data.length > 2 ? data[2] : data[1];
        }
    }

    public getCogAbilitiesNameByType(type: string): string {
        return `lib.${_.camelCase(type)}`;
    }

    updateTopChartsSize(): void {
        this.topSkillsWidth = this.viewType === this.selectViewOptions.pay ||
            this.viewType === this.selectViewOptions.recruit ? 80 : 120;
        this.topTechnicalSkillsCount = this.topTechnicalSkills?.values?.length || 0;
        this.topBehavioralSkillsCount = this.topBehavioralSkills?.values?.length || 0;
        const rowHeight = 32;
        this.topTechnicalSkillsHeight = this.topTechnicalSkillsCount * rowHeight;
        this.topBehavioralSkillsHeight = this.topBehavioralSkillsCount * rowHeight;
    }

    updateTopData(): void {
        this.topBehavioralSkills = this.processTopSkillsData(this.behavioralCompetencies, 'behavioral');
        this.topTechnicalSkills = this.processTopSkillsData(this.technicalCompetencies, 'technical');
        this.topTechTilesData = this.generateTechToolData(this.technologies, 'technology');
        this.topToolTilesData = this.generateTechToolData(this.tools, 'tool');
        if (!this.isIcClientUser) {
            this.topTechSkillsData = this.generateTechSkillsData(this.dependentTechSkills, 'technical');
        }
        this.updateTopChartsSize();
        this.setSkillsTechsWrapperClass();
    }

    processTopSkillsData(skills: any, section: string): any {
        const ret = {
            categories: [],
            values: [],
            benchmarks: [],
        };
        const view = this.viewType ? this.viewType : 'default';
        const amount = displayedAmountByView[section][view];
        if (skills?.length) {
            const topSkills = skills.slice(0, amount);
            topSkills.forEach((skill) => {
                ret.categories.push(skill.descriptions[0].name);
                ret.values.push(skill.descriptions[0].level);
                ret.benchmarks.push(0);
            });
        }
        return ret;
    }

    generateRespTreemapData(): void {
        const totalResps = this.responsibilities.length;
        const categoryLimit = 5;

        this.clearTopData();
        let otherDatumValue = 0;
        let otherCountOfSubcategories = 0;
        let lastPercentage = 100;
        this.responsibilities.slice(0, 5).forEach((responsibility) => {
            this.topResponsibilitySubCategories.push({
                name: responsibility.descriptions[0].name,
                description: responsibility.descriptions[0].description,
                parentId: responsibility.originalParent.id,
            });
        });

        this.unflattenedResponsibilities.forEach((category, index, array) => {
            const decimalValue = category.subCategories.length / totalResps;
            // make sure all the percentages add up
            let percentage = 0;
            let curCategoryNode: KfCategoryNode;
            if (array.length <= categoryLimit) {
                if (index !== array.length - 1) {
                    percentage = Math.round(decimalValue * 100);
                    lastPercentage -= percentage;
                } else if (index === array.length - 1) {
                    percentage = lastPercentage;
                }
            } else {
                if (index < categoryLimit - 1) {
                    percentage = Math.round(decimalValue * 100);
                    lastPercentage -= percentage;
                } else {
                    percentage = lastPercentage;
                }
            }

            if (index < categoryLimit - 1 || index === categoryLimit - 1 && array.length === categoryLimit) {
                this.responsibilityTreeMapData.push({
                    name: `${percentage}%`,
                    value: decimalValue,
                    color: TREE_MAP_COLOR_PALETTE[index],
                });
                curCategoryNode = {
                    color: TREE_MAP_COLOR_PALETTE[index],
                    id: category.id,
                    name: category.name,
                    subCategoryCount: category.subCategories.length,
                };
                this.topResponsibilityCategories.push(curCategoryNode);
                this.topResponsibilitySubCategories.forEach((subCategory) => {
                    if (subCategory.parentId === category.id) subCategory.parentNode = curCategoryNode;
                });
            } else if (index === array.length - 1) {
                otherDatumValue += decimalValue;
                otherCountOfSubcategories += category.subCategories.length;
                this.responsibilityTreeMapData.push({
                    name: `${percentage}%`,
                    value: otherDatumValue,
                    color: TREE_MAP_COLOR_PALETTE[categoryLimit - 1],
                });
                curCategoryNode = {
                    color: TREE_MAP_COLOR_PALETTE[categoryLimit - 1],
                    id: category.id,
                    name: this.translate.instant('pm.otherText'),
                    subCategoryCount: otherCountOfSubcategories,
                };
                this.topResponsibilityCategories.push(curCategoryNode);
                this.topResponsibilitySubCategories.forEach((subCategory) => {
                    if (subCategory.parentId === category.id) subCategory.parentNode = curCategoryNode;
                });
            } else {
                otherDatumValue += decimalValue;
                otherCountOfSubcategories += category.subCategories.length;
                curCategoryNode = {
                    color: TREE_MAP_COLOR_PALETTE[categoryLimit - 1],
                    id: category.id,
                    name: this.translate.instant('pm.otherText'),
                };
                this.topResponsibilitySubCategories.forEach((subCategory) => {
                    if (subCategory.parentId === category.id) subCategory.parentNode = curCategoryNode;
                });
            }
        });

        if (this.responsibilityChart?.nativeElement) {
            this.responsibilityTreeMap.series[0].setData(this.responsibilityTreeMapData, true);
        }

        this.drawResponsibilityTreeMap();
    }

    mergeAndSortBySubcategoryCount(categories: KfISpCategory[]): KfISpCategory[] {
        return _(categories)
            .groupBy('id')
            .map((categoryArray) => ({
                id: categoryArray[0].id,
                name: categoryArray[0].name,
                description: categoryArray[0].description,
                subCategories: categoryArray.reduce(
                    (accu, curr) => accu.concat(curr.subCategories),
                    []),
            }))
            .orderBy(cat => cat.subCategories.length, 'desc')
            .value();
    }

    generateDriversData(): boolean {
        this.driversHexData.data = [];
        const drivers = this.successProfile.sections.find(s => s.code === 'DRIVERS');
        if (drivers?.subCategories) {
            drivers.subCategories.forEach((sub) => {
                this.driversHexData.data.push(sub.descriptions[0]);
            });
        }
        return false;
    }

    generateTechToolData(allData: any, section: string): KfTarcSPTiles {
        const ret = { topElements: [] };

        const view = this.viewType ? this.viewType : 'default';
        const amount = displayedAmountByView[section][view];
        if (allData?.length) {
            const topData = allData.slice(0, amount);
            topData.forEach((datum) => {
                ret.topElements.push({
                    name: datum.title,
                });
            });
        }
        return ret;
    }

    generateTechSkillsData(data: any, section: string): KfTarcSPTiles {
        const ret = { topElements: [] };

        const view = this.viewType ? this.viewType : 'default';
        const amount = displayedAmountByView[section][view];
        if (data?.length) {
            const topData = data.slice(0, amount);
            topData.forEach((datum) => {
                ret.topElements.push({
                    name: datum.jobSkillComponentName,
                });
            });
        }
        return ret;
    }

    clearTopData(): void {
        this.topResponsibilityCategories = [];
        this.topResponsibilitySubCategories = [];
        this.responsibilityTreeMapData = [];
    }

    getSectionToTaskCard(spSection: KfISpSection): KfISpTasks[] {
        return spSection.tasks ? _.cloneDeep(spSection.tasks) : [];
    }

    getRegionalNorms(): Observable<any> {
        if (this.regionalNorms$ == null) {
            this.regionalNorms$ = this.successProfileService.getRegionalNorms('background')
                .pipe(publishReplay(1)) as ConnectableObservable<number>;
            this.regionalNorms$.connect();
        }
        return this.regionalNorms$;
    }

    getAllSubCategoryIds(): number[] {
        let subCategoryIds = _.chain(this.successProfile.sections)
            .flatMap('subCategories')
            .map('id')
            .value();
        subCategoryIds = _.without(subCategoryIds, undefined);
        return subCategoryIds;
    }

    async openSlider(defaultTab: string): Promise<void> {
        this.defaultTab = defaultTab;
        this.isSliderOpen = true;
        // Job Factors are not needed on View More Details page
        // this.jobFactors = await this.getJobFactors();
        this.growlService.clearInteractiveMessages();

        if (this.footerPositionDir) {
            setTimeout(() => this.footerPositionDir.setElementBottom(), 50);
        }
    }

    initProductForm(): void {
        const sub = this.productInputsForm.valueChanges.subscribe(() => {
            this.isAssessNextBtnDisabled = false;
        });

        this.subscriptions$.push(sub);
    }

    onAssessmentModalTabSelected(event): void {
        this.productInputsForm.reset();
        this.isAssessNextBtnDisabled = true;
        this.assessmentModalTabSelected = event;
    }

    createAssessmentProject(): void {
        if (this.hasLanguageAccess && !this.languagesAreMatching) {
            return;
        }
        this.isAssessmentModal = true;
        setTimeout(() => this.assessmentSelectedIndex = 0, 0);
    }

    leaveAssessPageChoice(_1: boolean): void {
        this.isAssessmentModal = false;
    }

    continueAssessPageChoice(): void {
        if (this.productInputsForm.value.product) {
            if (this.productTypes[this.assessmentModalTabSelected].id ===
                this.sharedConstantsService.PRODUCT_TACQ.productId) {
                KfNavigationUtil.navigateMenu(this.router, '/tacq', '/ap/redirect', {
                    queryParams: {
                        type: this.productInputsForm.value.product,
                        spId: this.successProfile.id,
                        country: this.selectedCountry.code,
                    },
                });
            } else if (this.productTypes[this.assessmentModalTabSelected].id ===
                this.sharedConstantsService.PRODUCT_TAMG.productId) {
                KfNavigationUtil.navigateMenu(this.router, '/tamg', '/ap/redirect', {
                    queryParams: {
                        type: this.productInputsForm.value.product,
                        spId: this.successProfile.id,
                        country: this.selectedCountry.code,
                    },
                });
            }
        }
    }

    convertTypeName(code: string): string {
        const lowerCase = code.toLowerCase().replace('_', '');
        return lowerCase.charAt(0).toUpperCase() + lowerCase.slice(1);
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    getSource(sourceType: string, returnProperty: string, cb: (arg: any) => {} = null): any {
        if (!this.successProfile) {
            return '';
        }
        const source = this.successProfile.sources.find(s => s.type === sourceType);
        let retVal: any = null;
        if (returnProperty === 'name') {
            retVal = `${source.firstName} ${source.lastName}`;
        } else {
            retVal = source[returnProperty] ? source[returnProperty] : null;
        }

        if (retVal && cb) {
            retVal = cb(retVal);
        }

        return retVal;
    }

    convertMillisToDate(millis: any): Date {
        return new Date(millis);
    }

    getSuccessProfileUserId(): number {
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

    evaluateIfOwnerUser(): boolean {
        let retVal = false;
        const successProfileUserId = this.getSuccessProfileUserId();
        const loggedInUserId = this.authService.getSessionInfo().User.UserId;
        if (successProfileUserId === loggedInUserId) {
            retVal = true;
        }
        return retVal;
    }

    openCopyModal(): void {
        if (!this.isCopyTextAdded) {
            this.copySPTitle = `${this.copySPTitle} ${this.translate.instant('lib.copyText')}`;
            this.isCopyTextAdded = true;
            this.jobCode = '';
        }
        this.isCopyModalOpen = true;
    }

    copySuccessProfile(): void {
        this.successProfile.titleChanged = true;
        if (this.collabEdit) {
            this.copySPTitle = `${this.copySPTitle} ${this.translate.instant('lib.sps')}`;
            this.jobCode = '';
            this.successProfile.status = KfSuccessProfileStatus.collabEdit;
            this.storageService.setItem('collabEditClone', 'true', KfStoreTypeEnum.SESSION);
        }
        this.successProfile.title = this.copySPTitle;
        this.successProfile.jobCode = this.jobCode;
        this.isCopyTextAdded = false;
        this.techSkillsTotal = 0;

        const originalLocale = this.spDetailsService.getLocaleFromFilter() || undefined;

        const localeFromFilter = this.selectedLanguage?.id || undefined;

        if (localeFromFilter) {
            this.spDetailsService.setLocaleFromFilter(localeFromFilter);
        }

        if (!this.selectedProfileCollections?.length) {
            // SP-14235 - not copying profile collections from parent profile
            delete this.successProfile.profileCollections;
        }

        this.loadingService.blockOnPendingRequests(
            async () => {
                try {
                    const { id } = await this.saveEdit(true, localeFromFilter, originalLocale);
                    this.isCopyModalOpen = false;
                    this.successProfile = _.omit(this.successProfile, 'titleChanged');
                    this.copySP = _.cloneDeep(this.successProfile);
                    if (!this.collabEdit) {
                        this.navigateToSuccessProfile(id);
                    } else {
                        this.createSpCollaboration(id);
                    }
                    // eslint-disable-next-line no-empty
                } finally { }
            },
        );
    }

    private createSpCollaboration(spId: string | number): void {
        const emailId = sessionStorage.getItem('HayGroup.User.name');
        const clientId = sessionStorage.getItem('HayGroup.Client.id');
        const sourceId = String(KFProductSourceIdsEnum.ProfileManager);
        this.successProfileService.getCreateSPCollabration(spId.toString(), emailId, clientId, sourceId).subscribe((response) => {
            if (response) {
                if(response?.data?.collabId && response?.data?.spId ) {
                    this.navigateToSuccessProfile(response.data.spId);
                }
            }
        });
    }

    cancelCopy(): void {
        this.isCopyModalOpen = false;
        this.jobCode = '';
    }

    createJobDescription() {
        if (this.hasLanguageAccess && !this.languagesAreMatching) {
            return;
        }
        this.router.navigate(['tarc/jd/detail/new/edit'], { queryParams: { fromSPId: this.successProfile.id }, });
    }

    async saveEdit(isClone: boolean, localeFromFilter?: string, originalLocale?: string) {
        return this.successProfileService.saveSpData(
            this.successProfile,
            this.successProfile.title,
            isClone,
            undefined,
            undefined,
            localeFromFilter,
            this.hasLanguageAccess,
            originalLocale,
            this.selectedProfileCollections);
    }

    downloadInterviewGuide(): void {
        const behavioralSection = this.successProfile.sections
            .find(section => section.code === 'BEHAVIORAL_SKILLS');
        this.behavioralCompetenciesCodes = _.reject(_.map(behavioralSection.subCategories, s => s.globalCode), _.isNil);
        if (behavioralSection?.subCategories?.length > 0) {
            this.isIGConfigModalOpen = true;
        } else {
            this.isIGEmptyModalOpen = true;
        }
    }

    closeIGEmptyModal(): void {
        this.isIGEmptyModalOpen = false;
    }

    downloadSuccessProfileReport(): void {
        this.showActionMenu = false;
        this.isSpPdfDownloadOpened = true;
    }

    relatedJDSearch(): void {
        if (this.hasLanguageAccess && !this.languagesAreMatching) {
            return;
        }
        this.router.navigate(['tarc/jd/search'], {
            queryParams: { relatedProfileId: this.successProfile.id },
        });
    }

    toggleEditMode(event: boolean): void {
        this.loadingService.blockOnPendingRequests(() => {
            if (event) {
                this.successProfileService.backupSuccessProfile(this.successProfile);
                if (typeof this.successProfileService.backupLastSuccessProfile === 'function') {
                    this.successProfileService.backupLastSuccessProfile(this.successProfile, 'BACKUP');
                }
                this.cacheAssessmentSettings();
                this.navigateToEditPage();
            }
        });
    }

    toggleEditSuccessProfile(toggleEvent: { event: boolean; editSuccessProfileFormValue: string}): void {
        this.showEditPopUp = false;
        this.loadingService.blockOnPendingRequests(() => {
            if (toggleEvent.event && toggleEvent.editSuccessProfileFormValue ===  this.translate.instant('lib.standard')) {
                this.successProfileService.backupSuccessProfile(this.successProfile);
                if (typeof this.successProfileService.backupLastSuccessProfile === 'function') {
                    this.successProfileService.backupLastSuccessProfile(this.successProfile, 'BACKUP');
                }
                this.cacheAssessmentSettings();
                this.navigateToEditPage();
            } else if (toggleEvent.event && toggleEvent.editSuccessProfileFormValue === this.translate.instant('lib.collaborative')) {
                this.collabEdit = true;
                this.copySuccessProfile();
            }
        });

    }

    showPopUp(): void {
        if (!this.collabData?.data?.collabIdAvailable && this.userPermissionsByEmail?.data?.userType !== KFUcpCollabEditEnum.Enabled) {
            this.toggleEditSuccessProfile({event: true, editSuccessProfileFormValue: KfEditSuccessProfileOptionsEnum.STANDARD});
        } else{
            this.showEditPopUp = true;
        }
    }

    closePopUp(): void {
        this.showEditPopUp = false;
    }

    getOriginUrl(): string {
        return window.location.origin;
    }

    public noAccessModal(): void {
        if (this.collabData?.data?.collabIdAvailable && this.userPermissionsByEmail?.data?.userType !== KFUcpCollabEditEnum.Enabled) {
            this.showEditPopUp = true;
            this.editCollaborativeAccess = false;
        } else if (this.userPermissionsByEmail?.data?.userType === KFUcpCollabEditEnum.Enabled && this.collabData?.data?.collabIdAvailable ) {
            const foundObject = this.collabData.data?.wonerAndAdminList?.find(obj => obj.email.toLowerCase() === this.userPermissionsByEmail?.data?.email?.toLowerCase());
            if(this.collabData?.data?.status === KFUcpCollabStatusEnum.NavigateToUCP || foundObject) {
                const originURL = this.getOriginUrl();
                window.open(`${originURL}/app/ucp/#/user/edit-configuration/?spId=${this.successProfile.id}&app=${this.currentApp}`, '_self');
            } else{
                this.showEditPopUp = true;
                this.editCollaborativeAccess = false;
            }
        }
    }

    navigateToEditPage(): void {
        this.isNavigateToEdit = true;
        this.router.navigate([`tarc/sp/detail/${this.successProfile.id}/edit`]);
    }

    async openMatchTool() {
        this.showMatchTool = true;
        this.jobFactors = await this.getJobFactors();
        setTimeout(() => this.profileMatchTool.openModal(), 0);
    }

    isShowMatchTool(): boolean {
        return (this.successProfile.profileType === SpTypeEnum.BestInClass
            || this.successProfile.profileType === SpTypeEnum.ONet
            || this.successProfile.profileType === SpTypeEnum.Levels)
            && +this.successProfile.standardHayGrade <= 22
            && this.successProfile.enableProfileMatchTool
            && !this.isExecutiveUngradedProfile;
    }

    openExecGrading(): void {
        if (this.hasLanguageAccess && !this.languagesAreMatching) {
            return;
        }
        this.showExecGrading = true;
    }

    onMatchToolChange(change: any): void {
        if (change.action === 'cancel') {
            this.showMatchTool = false;
        } else {
            this.successProfileService.calculateProfileGrade(
                this.successProfile.id,
                this.successProfile.jobRoleTypeId,
                change.factor,
            ).subscribe((gradeData) => {
                this.showMatchTool = false;
                this.navigateToSuccessProfile(gradeData.jobId);
            });
        }
    }

    toggleActionMenu() {
        this.initializeActionItems();
        this.showActionMenu = !this.showActionMenu;
        if (environment().envSuffix !== CN_PROD) {
            const sessionUserInfo = JSON.parse(sessionStorage.getItem('sessionInfo'));
            const userEmail = sessionUserInfo.user['username'];
            this.successProfileService.getUAMPermisssions(userEmail, KFProductSourceIdsEnum.ProfileManager).subscribe((response) => {
                if (response) {
                    this.userPermissionsByEmail = response;
                    this.successProfileService.getCollabId(this.successProfile.id).subscribe((data) =>{
                        if (data) {
                            this.collabData = data;
                            if (data.data.collabIdAvailable) {
                                this.showRemoveMenuItem = false;
                                this.showJobDescription = false;
                                this.showEditMenuItem = false;
                                this.showJobPricing = false;
                                this.canCreateAssessmentProject = false;
                                if (this.userPermissionsByEmail?.data?.userType !== KFUcpCollabEditEnum.Enabled) {
                                    this.showEditManageStakeholders = false;
                                } else {
                                    this.showEditManageStakeholders = true;
                                }
                            } else {
                                this.showEditManageStakeholders = false;
                                // SP-12586, not overridding access roles permissions check
                                if (this.showOrHideEditMenuItem()) {
                                    this.showEditMenuItem = true;
                                }
                            }
                            if ('wonerAndAdminList' in this.collabData.data) {
                                this.ownerObject = this.collabData?.data?.wonerAndAdminList.find(obj => obj.roleName === 'Owner');
                            }
                        }
                    });
                }
            });
        } else {
            this.showEditManageStakeholders = false;
            if (this.showOrHideEditMenuItem()) {
                this.showEditMenuItem = true;
            }
        }
    }

    onClickOutsideActionMenu(event): void {
        if (event.target
            && !event.target.classList.contains('menu-action-btn')
            && !event.target.classList.contains('arrow-down-actions')) {
            this.showActionMenu = false;
            this.cd.detectChanges();
        }
    }

    toggleSelectMenu(): void {
        this.showSelectMenu = !this.showSelectMenu;
    }

    onClickOutsideSelectMenu(event): void {
        if (event.target
            && !event.target.classList.contains('menu-select-text')
            && !event.target.classList.contains('menu-select-btn')
            && !event.target.classList.contains('arrow-down-select')) {
            this.showSelectMenu = false;
            this.cd.detectChanges();
        }
    }

    isTwoColumnsAlignment(): boolean {
        return this.topTechTilesData && !this.topTechTilesData.topElements?.length &&
            !this.topTechSkillsData?.topElements?.length ||
            (this.viewType === this.selectViewOptions.pay ||
                this.viewType === this.selectViewOptions.recruit) &&
            (this.topTechTilesData.topElements.length &&
                !this.topTechSkillsData?.topElements.length ||
                !this.topTechSkillsData?.topElements.length);
    }

    // Use below condition if gradingTool need to be disbaled for Edited Profiles
    get isExecutiveProfileEdited(): boolean {
        return this.successProfile.isExecutiveProfileEdited ? true : false;
    }

    checkPermissions(data): boolean {
        if (data?.value?.status === 204) {
            return false;
        }
        if (data?.hideJobInPM === 1) {
            return false;
        }
        if (!data.hayPoints) {
            return true;
        }
        if (data.profileType === SpTypeEnum.BestInClass || data.profileType === SpTypeEnum.Levels || data.profileType === SpTypeEnum.ONet) {
            return true;
        }

        if (data.status === 403 || data.status === 204 ||
            !this.pointRestrictionService.isSaveEnabled(data.hayPoints.totalPoints)) {
            return false;
        }
        return true;
    }

    redirectToSearch(): void {
        const permMsg = this.translationService.get('lib.noPermissionsSp');
        setTimeout(
            () => {
                this.growlService.createInteractiveErrorMessage(
                    permMsg, '', KfGrowlMessageType.ERROR, 'data', 100000);
            },
            1000);
        this.router.navigate(['/tarc/sp/search']);
    }

    onReloadPriceResult(sp: KfISuccessProfile): void {
        this.marketInsightConfig = {
            countryName: this.selectedCountry.name,
            jobRoleTypeId: sp.jobRoleTypeId,
            grade: parseInt(sp.standardHayGrade, 10),
            countryId: +this.selectedCountry.id,
            pricingService: this.pricingService,
            parentJobRoleTypeId: (sp as any).parentJobRoleTypeId,
        } as any;
    }

    /* ARCH Job creation: START */

    showCreateJobModel(): void {
        this.jobCode = '';
        this.jobTitle = '';

        const respSection = this.successProfile.sections.find((section: KfISpSection) => section.code === 'RESPONSIBILITY');
        const responsibilities = respSection.subCategories;
        const formattedResponsibilities = [];

        responsibilities.forEach(resp => {
            formattedResponsibilities.push({
                id: resp.id,
                level: resp.descriptions[0].level,
                type: resp.type,
            });
        });

        const respToSend = [{
            code: 'RESPONSIBILITY',
            id: respSection.id,
            subCategories: formattedResponsibilities
        }];

        const { id, jeLineGrade, shortProfile, hrLevel } = this.successProfile;

        forkJoin([
            this.successProfileService.calculateJobGradeResponsibility(id, jeLineGrade, respToSend, shortProfile, hrLevel),
            this.customGradeService.fetchCustomGradeSet(),
        ]).pipe(takeUntil(this.destroy$)).subscribe(([calculatedGradeValue, customGradeRes]) => {
            if (calculatedGradeValue?.data) {
                if (calculatedGradeValue.data?.hayPoints) {
                    this.successProfile.hayPoints = calculatedGradeValue.data.hayPoints;
                }
                if (calculatedGradeValue.data?.hrLevel) {
                    this.successProfile.hrLevel = calculatedGradeValue.data.hrLevel;
                }
                if (calculatedGradeValue.data?.shortProfile) {
                    this.successProfile.shortProfile = calculatedGradeValue.data.shortProfile;
                }
                if (calculatedGradeValue.data?.adjustedGrade) {
                    this.successProfile.standardHayGrade = calculatedGradeValue.data.adjustedGrade;
                }
                if (calculatedGradeValue.data?.jeLineGrade) {
                    this.successProfile.jeLineGrade = calculatedGradeValue.data.jeLineGrade;
                }
                if (calculatedGradeValue.data?.adjustedCustomGrades?.grades && this.successProfile.grade?.customGrades) {
                    this.successProfile.grade.customGrades = calculatedGradeValue.data.adjustedCustomGrades;
                }
            }
            if (customGradeRes) {
                this.successProfile['customGrade'] = customGradeRes;
                this.isCreateJobModal = true;
            }
            this.successProfileService.backupSuccessProfile(this.successProfile);
        });
    }

    shutoffCreateJob(event): void {
        this.isCreateJobModal = event;
    }

    back(): void {
        if (this.isSliderOpen) {
            this.isSliderOpen = false;
        } else {
            let path;
            if (this.currentURL.includes('add-job')) {
                path = '/job/create';
            } else if (this.currentURL.includes('ladder')) {
                path = '/job/ladder/compare-select';
            }
            KfNavigationUtil.navigateMenu(this.router, '/arch', path);
        }
    }
    /* ARCH Job creation: END */

    hover(event) {
        if (event?.srcElement) {
            const element = event.srcElement;
            this.hideTooltip = element.offsetHeight >= element.scrollHeight;
        }
    }

    checkJobCodeValidity(jobCode: string) {
        this.invalidJobCode = false;
        const validationParm = { job: { jobCode: jobCode.toString().trim() } };
        this.successProfileService.validateJobDetails(validationParm)
            .subscribe((valResult) => {
                if (valResult?.failedFields?.length) {
                    if (valResult.failedFields.indexOf('jobCode') > -1) {
                        this.invalidJobCode = true;
                    }
                } else {
                    this.invalidJobCode = false;
                }
            });
    }

    public toggleSpPdfDownload(visible: boolean): void {
        this.isSpPdfDownloadOpened = visible;
    }

    downloadReport(data: { excludeSections: number[]; isShowLevels: boolean; callBulkRunner: boolean }) {
        const storedLocaleFromFilter = this.spDetailsService.getLocaleFromFilter();
        const countryId = this.selectedCountry?.id;
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

    ngOnDestroy() {
        this.removeSubscriptions();
    }

    private removeSubscriptions(): void {
        this.destroy$.next(undefined);
        this.destroy$.complete();
    }

    async onCountrySelectionChange(event: KfICountry) {
        this.selectedCountry = event;
        this.marketInsights = await this.getMarketInsights();
        this.storageService.setItem('_selectedCountry', JSON.stringify(event));
        this.onReloadPriceResult(this.successProfile);
    }

    async getMarketInsights(): Promise<KfIMarketInsightsResults> {
        return this.marketInsightsDataService.getData({ successProfileId: this.successProfile?.id, countryId: parseInt(this.selectedCountry?.id, 10) });
    }

    async getJobFactors(): Promise<KfIJobFactor[]> {
        return this.jobFactorsDataService.getData({ jobRoleTypeId: this.successProfile?.jobRoleTypeId, successProfileId: this.successProfile?.id });
    }

    private getCountriesList(): Promise<KfICountry[]> {
        return this.spSharedService.getCountries().toPromise();
    }

    private getSelectedCountry(): KfICountry {
        const storedSelectedCountry = this.storageService.getItem('_selectedCountry');
        const selectedCountry = storedSelectedCountry ? JSON.parse(storedSelectedCountry) : this.countryArray.find(country => country.code === 'US');

        return selectedCountry;
    }

    private langsAreMatching(): boolean {
        const localeFromFilter = this.spDetailsService.getLocaleFromFilter();
        return localeFromFilter &&
                localeFromFilter === this.userLocale ||
                !localeFromFilter;
    }

    public onCopySP(sp: KFCopiedSP): void {
        this.copySPTitle = sp.title;
        this.jobCode = sp.jobCode;
        this.selectedLanguage = sp.selectedLanguage;
        this.selectedProfileCollections = sp.profileCollectionsIds;
        this.copySuccessProfile();
    }

    public navigateToParentProfile(id: number): void {
        if (this.successProfile?.parentJobDetails?.preferredLocale) {
            this.spDetailsService.setLocaleFromFilter(this.successProfile?.parentJobDetails?.preferredLocale);
        }
        this.navigateToSuccessProfile(id);
    }

    public canDeactivate(): Observable<boolean> | boolean {
        if (this.isNavigateToEdit || !this.hasLanguageAccess) {
            return true;
        }

        if (!this.isNavigateToEdit && this.userLocale) {
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

    public generateSkillCardTitle() {
        if (this.isIcClientUser) {
            this.skillCardTitle = 'pm.skills';
        } else {
            this.skillCardTitle = this.viewType === this.selectViewOptions.pay || this.viewType === this.selectViewOptions.recruit ? 'pm.hardSkills' : 'pm.skills';
        }
    }

    public generateToolsAndTechnoCardTitle() {
        if (this.isIcClientUser) {
            this.toolsAndTechnoCardTitle = 'pm.tools';
        } else {
            this.toolsAndTechnoCardTitle = this.viewType === this.selectViewOptions.pay || this.viewType === this.selectViewOptions.recruit ?
                'pm.technicalSkills' : 'pm.techTool';
        }
    }

    public checkPermissionAndRemoveProductType(
        permissionKey: string,
        productTypes: KfIProjectBundle[],
        productTypeToRemove: string,
    ): void {
        // Exclude the productType that are not available for the user based on UAM permissions
        if (this.permissions && permissionKey in this.permissions && !this.permissions[permissionKey]) {
            _.remove(productTypes, (productType) => productType.type === productTypeToRemove);
        }
    }

    public onProfileCollectionsUpdated(event: KfIJobPropEvent) {
        this.selectedProfileCollections = event.subPropertiesIds.map(Number);
    }
}
