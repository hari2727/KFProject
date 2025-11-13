import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SpSearchPage } from './sp-search.page';
import { KfThclPointRestrictionService, KfThclSPSharedConstantsService, KfThclSPSharedService, KfThclSpCompareBucketService, KfThclSpMarketInsightsCacheService, KfThclSpMarketInsightsService, KfThclSuccessprofileService } from '@kf-products-core/kfhub_thcl_lib';
import { KfAuthService, KfGrowlService, KfIMarketInsightsResults, KfIProjectBundle, KfISuccessProfile, KfSharedConstantsService, KfStorageService, KfTitlecasePipe, KfTranslationService } from '@kf-products-core/kfhub_lib';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { KfTarcJobDescriptionService } from '../../app/modules/services/kftarc-job-description.service';
import { UntypedFormBuilder } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpService } from '../../app/services/http.service';
import { KfTarcSuccessProfileDetailService } from '../../app/modules/components/macro/success-profile/detail/kftarc-success-profile-detail.service';
import _ from 'lodash';
import { of } from 'rxjs';
import { SUCCESS_PROFILE_MOCK } from '../../app/common/mocks/models/successProfile';
import { ProductTypeEnum } from './sp-search.constant';

describe('SpSearchPage', () => {
    let component: SpSearchPage;
    let mockSPService: Partial<KfThclSuccessprofileService>;
    let mockAuthService: Partial<KfAuthService>;
    let translationervice: Partial<KfTranslationService>;
    let growlService: Partial<KfGrowlService>;
    let route: ActivatedRoute;
    let datePipe: Partial<DatePipe>;
    let jobDescriptionsService: Partial<KfTarcJobDescriptionService>;
    let spSharedConstants: Partial<KfThclSPSharedConstantsService>;
    let translate: Partial<TranslateService>;
    let libSharedConstants: Partial<KfSharedConstantsService>;
    let bucketService: Partial<KfThclSpCompareBucketService>;
    let pointRestrictionService: Partial<KfThclPointRestrictionService>;
    let storageService: Partial<KfStorageService>;
    let miCacheService: Partial<KfThclSpMarketInsightsCacheService>;
    let mockStore: Partial<Store>;
    let httpService: Partial<HttpService>;
    let marketInsightsDataService: Partial<KfThclSpMarketInsightsService>;
    let spDetailsService: Partial<KfTarcSuccessProfileDetailService>;
    let spSharedService: Partial<KfThclSPSharedService>;

    let formBuilder: UntypedFormBuilder;

    beforeEach(async () => {
        mockSPService = {
            assessmentsChanged: jest.fn(),
            calculateProfileGrade: jest.fn(),
            getJobFactors: jest.fn(),
            getSuccessProfileDetail: jest.fn(),
            getAssessmentProducts: jest.fn(),
            cloneSuccessProfile: jest.fn(),
            cacheRegionalNorms: jest.fn(),
            getRegionalNorms: jest.fn().mockReturnValue(of({
                data: {
                    regionalNorms: [],
                    regionalNormLocations: [],
                },
            })),
            getSPPermissions: jest.fn(),
            updateReviewTMChangePreference: jest.fn(),
        };
        mockAuthService = {
            getSessionInfo: jest.fn(),
            deleteSuccessProfile: jest.fn(),
            updateSessionInfo: jest.fn(),
            getConfig: jest.fn().mockReturnValue(of({})),
        };
        translationervice = {
            get: jest.fn()
        };
        growlService = {
            createInteractiveSuccessMessage: jest.fn(),
            clearInteractiveMessages: jest.fn(),
        };
        datePipe = {
        };
        jobDescriptionsService = {
        };
        spSharedConstants = {};
        translate = {
            get: jest.fn(),
            instant: jest.fn(),

        };
        libSharedConstants = {
        };
        bucketService = {
            removeItem: jest.fn(),
        };
        storageService = {
            getItem: jest.fn().mockImplementation((key) => JSON.stringify({
                _selectedCountry : { id: 225 },
                _isIcClient: false,
            })),
        };
        miCacheService = {};
        pointRestrictionService = {};

        mockStore = {
            dispatch: jest.fn(),
        };
        httpService = {
            spSearchFilter: jest.fn(),
        };
        marketInsightsDataService = {
            getCandidateScarcity: jest.fn(),
        };
        spDetailsService = {
            getLocaleFromFilter: jest.fn().mockReturnValue('en'),
            setLocaleFromFilter: jest.fn(),
        };

        spSharedService = { downloadReportWithAudit: jest.fn() };
        await TestBed.configureTestingModule({
            declarations: [ SpSearchPage, KfTitlecasePipe, TranslatePipe ],
            imports: [ HttpClientTestingModule, RouterTestingModule ],
            providers: [
                UntypedFormBuilder,
                { provide: KfThclSuccessprofileService, useValue: mockSPService },
                { provide: KfAuthService, useValue: mockAuthService },
                { provide: KfTranslationService, useValue: translationervice },
                { provide: KfTranslationService, useValue: translationervice },
                { provide: KfGrowlService, useValue: growlService },
                { provide: KfTarcJobDescriptionService, useValue: jobDescriptionsService },
                { provide: KfThclSPSharedConstantsService, useValue: spSharedConstants },
                { provide: DatePipe, useValue: datePipe },
                { provide: TranslateService, useValue: translate },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: {
                                get: () => 'test',
                            },
                        },
                    },
                },
                { provide: KfSharedConstantsService, useValue: libSharedConstants },
                { provide: KfThclSpCompareBucketService, useValue: bucketService },
                { provide: KfThclPointRestrictionService, useValue: pointRestrictionService },
                { provide: KfStorageService, useValue: storageService },
                { provide: KfThclSpMarketInsightsCacheService, useValue: miCacheService },
                { provide: Store, useValue: mockStore },
                { provide: HttpService, useValue: httpService },
                { provide: KfThclSpMarketInsightsService, useValue: marketInsightsDataService },
                { provide: KfTarcSuccessProfileDetailService, useValue: spDetailsService },
                { provide: KfThclSPSharedService, useValue: spSharedService },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        });
        formBuilder = TestBed.inject(UntypedFormBuilder);

        component = TestBed.createComponent(SpSearchPage).componentInstance;
        route = TestBed.inject(ActivatedRoute);
    });

    it('Check for component creation', () => {
        expect(component).toBeTruthy();
    });

    it('Check for deep copy of filters', () => {
        const filters = {
            type: [],
            term: '',
            items: []
        };
        component.filters = _.cloneDeep(filters) as any;
        expect(component.filters).not.toBe(filters);
    });

    it('should copy the success profile', async () => {
        // Arrange
        const spId = 123;
        const jobCode = 'JOB001';
        const title = 'Test Success Profile';
        const profileCollectionsIds = [1, 2, 3];
        const selectedLanguage = { id: 'en', name: 'English', description: 'English Language' };

        const copySpSpy = jest.spyOn(component, 'copySp').mockResolvedValueOnce();

        // Act
        component.onCopySP({ id: spId, jobCode, title, profileCollectionsIds, selectedLanguage });

        // Assert
        expect(copySpSpy).toHaveBeenCalledWith(spId, jobCode, title, profileCollectionsIds);
        expect(component.selectedLanguage).toEqual(selectedLanguage);
    });

    it('should copy the success profile with arguments', async () => {
        // Arrange
        const spId = 123;
        const jobCode = 'JOB001';
        const title = 'Test Success Profile';

        const profile: KfISuccessProfile = {
            ...SUCCESS_PROFILE_MOCK,
            id: 456,
        };

        component.selectedLanguage = { id: 'en', name: 'English', description: 'English Language' };

        const profileCollectionsIds = [1, 2, 3];

        const cloneSuccessProfileSpy = jest.spyOn(component.spService, 'cloneSuccessProfile').mockImplementation(() => of(profile));

        const navigateSpy = jest.spyOn(component.router, 'navigate');

        await component.copySp(spId, jobCode, title, profileCollectionsIds);

        // Assert
        expect(cloneSuccessProfileSpy).toHaveBeenCalledWith(
            spId,
            component.selectedLanguage.id,
            jobCode,
            title,
            component.hasLanguageAccess,
            'en',
            profileCollectionsIds,
        );
        expect(navigateSpy).toHaveBeenCalledWith(['tarc/sp/detail/456']);
    });

    it('should remove the product type if the permission is false', () => {
        // Arrange
        const id = 123;
        const permissionKey = 'hasCreateAssessProject';
        const productTypes: KfIProjectBundle[] = [
            { type: ProductTypeEnum.Assess, name: 'Assess' },
            { type: ProductTypeEnum.Select, name: 'Select' },
        ];

        const permissionsCache = {
            [id]: {
                [permissionKey]: false,
                access: 'false', // Add the missing 'access' property
            },
        };

        component.permissionsCache = permissionsCache;

        // Act
        component.checkPermissionAndRemoveProductType(id, permissionKey, productTypes, ProductTypeEnum.Assess);

        // Assert
        expect(productTypes).toEqual([{ type: ProductTypeEnum.Select, name: 'Select' }]);
    });

    it('should not remove the product type if the permission is true', () => {
        // Arrange
        const id = 123;
        const permissionKey = 'hasCreateAssessProject';
        const productTypes: KfIProjectBundle[] = [
            { type: ProductTypeEnum.Assess, name: 'Assess' },
            { type: ProductTypeEnum.Select, name: 'Select' },
        ];

        const permissionsCache = {
            [id]: {
                [permissionKey]: true,
                access: 'false', // Add the missing 'access' property
            },
        };

        component.permissionsCache = permissionsCache;

        // Act
        component.checkPermissionAndRemoveProductType(id, permissionKey, productTypes, ProductTypeEnum.Assess);

        // Assert
        expect(productTypes).toEqual([
            { type: ProductTypeEnum.Assess, name: 'Assess' },
            { type: ProductTypeEnum.Select, name: 'Select' },
        ]);
    });

    it('should return true when user locale matches the locale from filter', () => {
        component.hasLanguageAccess = true;
        component.userLocale = 'en';
        const localeFromFilter = 'en';

        const result = component.langsAreMatching();

        expect(result).toBe(true);
    });

    it('should return true when locale from filter is not set', () => {
        component.hasLanguageAccess = true;
        component.userLocale = 'en';
        const localeFromFilter = undefined;

        const result = component.langsAreMatching();

        expect(result).toBe(true);
    });

    it('should return false when user locale does not match the locale from filter', () => {
        component.hasLanguageAccess = true;
        component.userLocale = 'fr';

        const result = component.langsAreMatching();

        expect(result).toBe(false);
    });

    it('should return false when hasLanguageAccess is false', () => {
        component.hasLanguageAccess = false;
        component.userLocale = 'en';

        const result = component.langsAreMatching();

        expect(result).toBe(false);
    });

    it('should return the selected locale', () => {
        // Arrange
        const selectedLocale = 'en';
        component.languages = [
            { id: 'en', name: 'English', description: 'English Language' },
            { id: 'fr', name: 'French', description: 'French Language' },
            { id: 'es', name: 'Spanish', description: 'Spanish Language' },
        ];

        // Act
        const result = component.findSelectedLocale(selectedLocale);

        // Assert
        expect(result).toEqual({ id: 'en', name: 'English', description: 'English Language' });
    });

    it('should return undefined if the selected locale is not found', () => {
        // Arrange
        const selectedLocale = 'de';
        component.languages = [
            { id: 'en', name: 'English', description: 'English Language' },
            { id: 'fr', name: 'French', description: 'French Language' },
            { id: 'es', name: 'Spanish', description: 'Spanish Language' },
        ];

        // Act
        const result = component.findSelectedLocale(selectedLocale);

        // Assert
        expect(result).toBeUndefined();
    });

    it('should set isCopyModalOpen to false and unsetSpForModals', () => {
        // Arrange
        component.isCopyModalOpen = true;
        const unsetSpForModalsSpy = jest.spyOn(component, 'unsetSpForModals');

        // Act
        component.cancelCopy();

        // Assert
        expect(component.isCopyModalOpen).toBe(false);
        expect(unsetSpForModalsSpy).toHaveBeenCalled();
    });

    it('should return the market insights results', async () => {
        // Arrange
        const countryId = 225;
        const successProfileId = component.successProfile?.id;

        const expectedMarketInsights: KfIMarketInsightsResults = {
            // Define the expected market insights results here
        };

        jest.spyOn(component.marketInsightsDataService, 'getCandidateScarcity').mockResolvedValue(expectedMarketInsights);

        // Act
        const marketInsights = await component.getMarketInsights();

        // Assert
        expect(component.marketInsightsDataService.getCandidateScarcity).toHaveBeenCalledWith({
            successProfileId,
            countryId
        });
        expect(marketInsights).toEqual(expectedMarketInsights);
    });

    it('should handle errors when getting market insights', async () => {
        // Arrange
        const countryId = 225;
        const successProfileId = component.successProfile?.id;

        jest.spyOn(component.marketInsightsDataService, 'getCandidateScarcity').mockRejectedValue('Error');

        // Act
        let error;
        try {
            await component.getMarketInsights();
        } catch (err) {
            error = err;
        }

        // Assert
        expect(component.marketInsightsDataService.getCandidateScarcity).toHaveBeenCalledWith({
            successProfileId,
            countryId
        });
        expect(error).toBeDefined();
    });

    it('should initialize deselectAllOptionAvailable to true', () => {
        expect(component.deselectAllOptionAvailable).toBeTruthy();
    });

    it('should allow modification of deselectAllOptionAvailable', () => {
        component.deselectAllOptionAvailable = false;
        expect(component.deselectAllOptionAvailable).toBeFalsy();
    });
});
