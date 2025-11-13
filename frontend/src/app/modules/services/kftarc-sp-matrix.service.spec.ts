import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { KfTarcSpMatrixService } from './kftarc-sp-matrix.service';
import { KfActiveAppService, KfAuthService, KfCacheService, KfGrowlService, KfSpUtilsService, KfLoadingControllerService, KfStorageService, KfTranslationService } from '@kf-products-core/kfhub_lib';
import { KfThclSuccessprofileService, KfThclTalentArchitectConstantsService, KfThclSPSharedService, KfThclSPSharedConstantsService } from '@kf-products-core/kfhub_thcl_lib';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { SortColumn, SpSearchFilterEnum } from '../../../pages/sp-search/sp-search.constant';
import { getFilterEncodedQuery } from '@kf-products-core/kfhub_thcl_lib/domain';
import { MessageService } from 'primeng/api';



describe('KfTarcSpMatrixService', () => {
    let service: KfTarcSpMatrixService;
    let kfAuthServiceMocks: Partial<KfAuthService>;
    let kfThclSuccessprofileServiceMocks: Partial<KfThclSuccessprofileService>;
    let kfCacheServiceMocks: Partial<KfCacheService>;
    let kfThclTalentArchitectConstantsServiceMocks: Partial<KfThclTalentArchitectConstantsService>;
    let kfThclSPSharedServiceMocks: Partial<KfThclSPSharedService>;
    let kfSpUtilsServiceMocks: Partial<KfSpUtilsService>;
    let kfGrowlServiceMocks: Partial<KfGrowlService>;
    let kfTranslationServiceMocks: Partial<KfTranslationService>;
    let mockKfThclSPSharedConstantsService: Partial<KfThclSPSharedConstantsService>;
    let mockKfLoadingControllerService: Partial<KfLoadingControllerService>;
    let mockKMessageService: Partial<MessageService>;
    let httpMock: HttpTestingController;
    let getNamesMock;

    beforeEach(() => {
        getNamesMock = {
            getNames: jest.fn()
        };
        kfAuthServiceMocks = {authHttpCallv2: jest.fn()};
        kfGrowlServiceMocks = {
            createInteractiveSuccessMessage: jest.fn(),
            clearInteractiveMessages: jest.fn(),
            open: jest.fn().mockReturnValue(of()),
        };

        kfThclSPSharedServiceMocks = {
            downloadMassiveReport: jest.fn().mockReturnValue(of()),
        };

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, TranslateModule.forRoot()],
            providers: [
                { provide: ActivatedRoute, useValue: { params: of({ id: 'testId' }) } },
                { provide: KfAuthService, useValue: kfAuthServiceMocks },
                { provide: KfThclSuccessprofileService, useValue: kfThclSuccessprofileServiceMocks },
                { provide: KfCacheService, useValue: kfCacheServiceMocks },
                { provide: KfActiveAppService, useValue: {
                    isKfArch: jest.fn(),
                    isKfTarc: jest.fn(),
                } },
                { provide: KfThclTalentArchitectConstantsService, useValue: kfThclTalentArchitectConstantsServiceMocks },
                { provide: KfThclSPSharedService, useValue: kfThclSPSharedServiceMocks },
                { provide: KfSpUtilsService, useValue: kfSpUtilsServiceMocks },
                { provide: KfGrowlService, useValue: kfGrowlServiceMocks },
                { provide: KfTranslationService, useValue: kfTranslationServiceMocks },
                { provide: KfThclSPSharedConstantsService, useValue: mockKfThclSPSharedConstantsService },
                { provide: KfLoadingControllerService, useValue: mockKfLoadingControllerService },
                { provide: MessageService, useValue: mockKMessageService },
                {
                    provide: TranslateService,
                    useValue: {
                        get: jest.spyOn(TranslateService.prototype, 'get').mockReturnValue(of['mocked translation'])
                    }
                },
                KfTarcSpMatrixService,
                KfThclSuccessprofileService,
                KfThclTalentArchitectConstantsService,
                KfStorageService,
            ]
        });
        httpMock = TestBed.inject(HttpTestingController);

        service = TestBed.inject(KfTarcSpMatrixService);

    });
    afterEach(() => {
        httpMock?.verify();
    });


    it('Test for filter values', () => {
        const filters = [
            { type: SpSearchFilterEnum.ProfileCollections, value: 'test1' },
            { type: SpSearchFilterEnum.ProfileType, value: 'test2' },
            { type: SpSearchFilterEnum.SearchSource, value: 'test3' },
            { type: SpSearchFilterEnum.Functions, value: 'test4' },
            { type: SpSearchFilterEnum.SubFunctions, value: 'test5' },
            { type: 'OtherFilter', value: 'test6' },
        ];

        const sourceAndFuncFilters =
            filters.filter(f => [
                SpSearchFilterEnum.ProfileCollections,
                SpSearchFilterEnum.ProfileType,
                SpSearchFilterEnum.SearchSource,
                SpSearchFilterEnum.Functions,
                SpSearchFilterEnum.SubFunctions].some(filter => f.type === filter));

        const encodedQuery = getFilterEncodedQuery(SortColumn.JobTitle, '', [], sourceAndFuncFilters, null, null);
        const url = 'searchColumn=JOB_TITLE&searchString=&filterBy=PROFILE_COLLECTIONS%';
        const url2 = '7CPROFILE_TYPE%7CSEARCH_SOURCE%7CFUNCTIONS%7CSUBFUNCTIONS&filterValues=test1%7Ctest2%7Ctest3%7Ctest4%7Ctest5&sortColumn=MODIFIED_ON&sortBy=DESC';
        expect(encodedQuery).toBe(url + url2);
    });

    it('Test for  load function', () => {
        const mockNames = {};
        Object.defineProperty(getNamesMock, 'get', { value: jest.fn().mockReturnValue(of(mockNames)) });
    });

    describe('isExecutiveUngraded', () => {
        it('should return true if job is executive and has min and max properties', () => {
            // Arrange
            const job = {
                isExecutive: true,
                min: 100,
                max: 200
            };

            // Act
            const result = service.isExecutiveUngraded(job);

            // Assert
            expect(result).toBe(true);
        });

        it('should return false if job is not executive', () => {
            // Arrange
            const job = {
                isExecutive: false,
                min: 100,
                max: 200
            };

            // Act
            const result = service['isExecutiveUngraded'](job);

            // Assert
            expect(result).toBe(false);
        });

        it('should return false if job does not have min property', () => {
            // Arrange
            const job = {
                isExecutive: true,
                max: 200
            };

            // Act
            const result = service['isExecutiveUngraded'](job);

            // Assert
            expect(result).toBe(false);
        });

        it('should return false if job does not have max property', () => {
            // Arrange
            const job = {
                isExecutive: true,
                min: 100
            };

            // Act
            const result = service['isExecutiveUngraded'](job);

            // Assert
            expect(result).toBe(false);
        });

        it('should return false if job does not have min and max properties', () => {
            // Arrange
            const job = {
                isExecutive: true
            };

            // Act
            const result = service['isExecutiveUngraded'](job);

            // Assert
            expect(result).toBe(false);
        });
    });

});
