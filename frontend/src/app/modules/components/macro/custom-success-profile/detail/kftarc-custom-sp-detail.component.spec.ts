import { KfIJobPropEvent, KfThclSPSharedService, KfThclSpJobFactorsService, KfThclSpMarketInsightsService, KfThclSuccessprofileService, KfThclPointRestrictionService, KfThclSPPricingService, KfThclSpCompareBucketService, KfThclCustomGradeService } from '@kf-products-core/kfhub_thcl_lib';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KfAuthService, KfBannerService, KfConfigService, KfDropdownService, KfGrowlService, KfIProjectBundle, KfLoadingControllerService, KfSharedConstantsService, KfStorageService, KfTitlecasePipe, KfTranslationService } from '@kf-products-core/kfhub_lib';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateLoader, TranslatePipe } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { mocks } from '../../../../../common/mocks';
import { KfTarcCustomSPDetailComponent } from './kftarc-custom-sp-detail.component';
import { KfTarcSuccessProfileDetailService } from './kftarc-custom-success-profile-detail.service';
import { KfTarcSpLearnDevService } from '../../../../services/kftarc-sp-learn-dev.service';
import { ProductTypeEnum } from '../../../../../../pages/sp-search/sp-search.constant';
import { actionLocaleQuery } from '../../../../../core/effects/core.actions';

jest.mock('Highcharts', () => ({
    modules: {
        exporting: jest.fn(),
    },
}));

jest.mock('@kf-products-core/kfhub_lib/tracking', () => ({
    getSMCXSurveyScopes: () => ({
        ProfileManager: {/* mock value here */}
    }),
}));

describe('KfTarcCustomSPDetailComponent', () => {
    let component: KfTarcCustomSPDetailComponent;
    let fixture: ComponentFixture<KfTarcCustomSPDetailComponent>;
    let mockStore: Partial<Store>;
    let mockDatePipe: Partial<DatePipe>;
    let spDetailsService: Partial<KfTarcSuccessProfileDetailService>;

    let mockSuccessProfileService = {
        getJobRoles: jest.fn().mockReturnValue(of({/* mock response */})),
        getUserEditedAttrs: jest.fn().mockReturnValue({
            name: false,
            description: false,
            dependents: false,
            isNewSubCategory: false
        }),
        resetUpdatedNorm: jest.fn(),
        getClientProfileCollections: jest.fn().mockReturnValue(of([
            {
                profileCollectionsName: 'PC 1',
                profileCollectionId: 1,
            },
            {
                profileCollectionsName: 'PC 2',
                profileCollectionId: 2,
            }
        ])),
        clearUnflattenedSuccessProfile: jest.fn(),
        getUnflattenedSuccessProfile: jest.fn(),
        cacheRegionalNorms: jest.fn(),
        createJobProfile: jest.fn().mockReturnValue(of({ id: 123 })),
    };

    let activatedRoute: ActivatedRoute;

    let mockAuthService: Partial<KfAuthService>;

    const bucketServiceMock = {
        getInvokedLocation: jest.fn().mockReturnValue('/arch/job/search')
    };

    let KfThclSPSharedServiceMocks: Partial<KfThclSPSharedService>;

    let KfDropdownServiceMock: Partial<KfDropdownService>;

    let KfGrowlServiceMock: Partial<KfGrowlService> = {
        clearInteractiveMessages: jest.fn(),
    };

    let KfThclSpJobFactorsServiceMock: Partial<KfThclSpJobFactorsService>;

    let KfThclSpMarketInsightsServiceMock: Partial<KfThclSpMarketInsightsService>;

    let KfThclPointRestrictionServiceMock: Partial<KfThclPointRestrictionService>;

    let KfThclSPPricingServiceMock: Partial<KfThclSPPricingService>;

    let KfStorageServiceMock: Partial<KfStorageService>;

    let KfTranslationServiceMock = {
        get: jest.fn(),
    };

    let mockRouter: Partial<Router>;

    const mockCustomGradeService = {
        getCustomGradePermission: jest.fn().mockReturnValue(of(true)),
        fetchCustomGradeSet: jest.fn().mockReturnValue(of({
            country: null,
            countryCode: '-1',
            customGradesets: [
                { gradeSetId: '62821', gradeSetName: 'demo test', gradeSetStandard: '1', orgDefault: true },
                { gradeSetId: '54406', gradeSetName: 'SP-6587', gradeSetStandard: '1', orgDefault: false }
            ],
        })),
    };

    let mockKfLoadingControllerService: Partial<KfLoadingControllerService>;

    let libSharedConstants: Partial<KfSharedConstantsService> = {};

    beforeEach(async () => {
        mockStore = {
            dispatch: jest.fn(),
            pipe: jest.fn().mockReturnValue(of([])),
        };

        mockDatePipe = {
        };

        mockAuthService = {
            getSessionInfo: jest.fn().mockReturnValue({
                User: { Locale: 'en' },
                Client: { name: 'Client Name'},
            }),
            getConfig: jest.fn().mockReturnValue(of({})),
            getPermissions: jest.fn().mockReturnValue(of({})),
            getSpContentUpdateSub: jest.fn().mockReturnValue(of({})),
        };

        mockRouter = {
            navigate: jest.fn(),
            url: 'arch/job/summary'
        };

        KfStorageServiceMock = {
            getItem: jest.fn(() => JSON.stringify([234])),
            removeItem: jest.fn(),
            setItem: jest.fn(),
        };

        spDetailsService = {
            getLocaleFromFilter: jest.fn().mockReturnValue('en'),
            setLocaleFromFilter: jest.fn(),
            selectViewOptions: {
                select: 'select',
                recruit: 'recruit',
                pay: 'pay'
            },
        };

        await TestBed.configureTestingModule({
            declarations: [ KfTarcCustomSPDetailComponent, KfTitlecasePipe, TranslatePipe],
            imports: [
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: mocks.services.translateLoader,
                    },
                }),
            ],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            data: {
                                list: [0, 10, []], // Replace with your desired test data
                            },
                        },
                        data: of({ spData: mocks.models.SUCCESS_PROFILE_MOCK }),
                    },
                },
                { provide: KfAuthService, useValue: mockAuthService },
                { provide: Store, useValue: mockStore },
                { provide: DatePipe, useValue: mockDatePipe },
                { provide: KfThclSuccessprofileService, useValue: mockSuccessProfileService },
                { provide: KfThclSPSharedService, useValue: KfThclSPSharedServiceMocks },
                { provide: KfDropdownService, useValue: KfDropdownServiceMock },
                { provide: KfGrowlService, useValue: KfGrowlServiceMock },
                { provide: KfThclSpJobFactorsService, useValue: KfThclSpJobFactorsServiceMock },
                { provide: KfThclSpMarketInsightsService, useValue: KfThclSpMarketInsightsServiceMock },
                { provide: KfThclPointRestrictionService, useValue: KfThclPointRestrictionServiceMock },
                { provide: KfThclSPPricingService, useValue: KfThclSPPricingServiceMock },
                { provide: KfStorageService, useValue: KfStorageServiceMock },
                { provide: KfTranslationService, useValue: KfTranslationServiceMock },
                { provide: Router, useValue: mockRouter },
                { provide: KfTarcSuccessProfileDetailService, useValue: spDetailsService },
                { provide: KfThclSpCompareBucketService, useValue: bucketServiceMock },
                { provide: KfConfigService, useValue: {
                    currentMessage: of({}),
                } },
                { provide: KfThclCustomGradeService, useValue: mockCustomGradeService },
                { provide: KfTarcSpLearnDevService, useValue: {} },
                { provide: KfLoadingControllerService, useValue: mockKfLoadingControllerService },
                { provide: KfSharedConstantsService, useValue: libSharedConstants },
                { provide: KfBannerService, useValue:
                    {
                        getBanners: jest.fn().mockReturnValue(of({/* mock response here */})),
                        banners: of({}),
                    },
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(KfTarcSPDetailComponent);
        component = fixture.componentInstance;
        component.successProfile = mocks.models.SUCCESS_PROFILE_MOCK;
        component.selectedProfileCollections = [1, 2, 3];
        activatedRoute = TestBed.inject(ActivatedRoute);
        fixture.detectChanges();
    });


    it('should update selectedProfileCollections', () => {
        // Arrange
        const event: KfIJobPropEvent = {
            subPropertiesIds: ['1', '2', '3'],
        };

        // Act
        component.onProfileCollectionsUpdated(event);

        // Assert
        expect(component.selectedProfileCollections).toEqual([1, 2, 3]);
    });

    it('should remove the product type if the permission is false', () => {
        // Arrange
        const permissionKey = 'hasCreateAssessProject';
        const productTypes: KfIProjectBundle[] = [
            { type: ProductTypeEnum.Assess, name: 'Assess' },
            { type: ProductTypeEnum.Select, name: 'Select' },
        ];
        component.permissions = {
            hasCreateAssessProject: false,
            access: 'true',
        };

        // Act
        component.checkPermissionAndRemoveProductType(permissionKey, productTypes, 'Assess');

        // Assert
        expect(productTypes.length).toBe(2);
        expect(productTypes[0].type).toBe(ProductTypeEnum.Assess);
    });

    it('should generate the correct title for tools and technologies card', () => {
        // Arrange
        component.isIcClientUser = true;
        component.viewType = component.selectViewOptions.recruit;

        // Act
        component.generateToolsAndTechnoCardTitle();

        // Assert
        expect(component.toolsAndTechnoCardTitle).toBe('pm.tools');
    });

    it('should generate the skill card title correctly for IC client user', () => {
        // Arrange
        component.isIcClientUser = true;
        component.viewType = '';

        // Act
        component.generateSkillCardTitle();

        // Assert
        expect(component.skillCardTitle).toBe('pm.skills');
    });

    it('should generate the skill card title correctly for non-IC client user with pay/recruit view type', () => {
        // Arrange
        component.isIcClientUser = false;
        component.viewType = component.selectViewOptions.pay;

        // Act
        component.generateSkillCardTitle();

        // Assert
        expect(component.skillCardTitle).toBe('pm.hardSkills');
    });

    it('should generate the skill card title correctly for non-IC client user with other view types', () => {
        // Arrange
        component.isIcClientUser = false;
        component.viewType = '';

        // Act
        component.generateSkillCardTitle();

        // Assert
        expect(component.skillCardTitle).toBe('pm.skills');
    });

    it('should return true if isNavigateToEdit is true or hasLanguageAccess is false', () => {
        // Arrange
        component.isNavigateToEdit = true;
        component.hasLanguageAccess = true;

        // Act
        const result = component.canDeactivate();

        // Assert
        expect(result).toBeTruthy();
    });

    it('should dispatch actionLocaleQuery and return an Observable if isNavigateToEdit is false and hasLanguageAccess is true', () => {
        // Arrange
        component.isNavigateToEdit = false;
        component.hasLanguageAccess = true;
        const languagePreferenceId = 6;
        const locale = component.userLocale;
        jest.spyOn(component.store, 'dispatch');
        jest.spyOn(component.navigateAwaySelection$, 'subscribe');

        // Act
        const result = component.canDeactivate();

        // Assert
        expect(component.store.dispatch).toHaveBeenCalledWith(actionLocaleQuery({
            languagePreferenceId,
            locale,
        }));
        expect(result).toBeInstanceOf(Observable);
    });
});
