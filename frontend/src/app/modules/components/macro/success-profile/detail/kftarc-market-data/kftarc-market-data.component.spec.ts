import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KfTarcMarketDataComponent } from './kftarc-market-data.component';
import { TranslateLoader, TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { KfAuthService, KfCacheService, KfLoadingControllerService } from '@kf-products-core/kfhub_lib';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { KfTarcMarketSkillsService } from '../../../../../services/kftarc-market-skills.service';
import { KfThclSpMarketInsightsCacheService } from '@kf-products-core/kfhub_thcl_lib';
import { KfTarcSuccessProfileDetailService } from '../kftarc-success-profile-detail.service';

export class FakeLoader implements TranslateLoader {
    getTranslation() {
        return of({ key: 'value' });
    }
}
describe('KfTarcMarketDataComponent', () => {
    let component: KfTarcMarketDataComponent;
    let fixture: ComponentFixture<KfTarcMarketDataComponent>;
    let mockAuthService;

    beforeEach(() => {
        mockAuthService = {
            getConfig: jest.fn().mockReturnValue(of({ tierOneTierTwoList: [] }))
        };
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
            ],
            declarations: [KfTarcMarketDataComponent, TranslatePipe],
            providers:[
                { provide: KfTarcSuccessProfileDetailService, useValue: {} },
                { provide: KfAuthService, useValue: {getSessionInfo: jest.fn()} },
                { provide: KfCacheService, useValue: {save: jest.fn()} },
                { provide: TranslateService, useValue: {instant: jest.fn()} },
                { provide: DecimalPipe, useValue: {
                    transform: jest.fn(),
                } },
                { provide: KfTarcMarketSkillsService, useValue: {
                    getSkills: jest.fn(),
                    updateDiffs: jest.fn(),
                } },
                { provide: KfLoadingControllerService, useValue: {
                    blockOnPendingRequests: jest.fn(),
                } },
                { provide: KfThclSpMarketInsightsCacheService, useValue: {
                    getSalaryRange: jest.fn(),
                    getCandidateScarcity: jest.fn(),
                    getMixOfPay : jest.fn(),
                    getMarketSalary: jest.fn(),
                    getDifficultyToDevelop: jest.fn(),
                } },
                { provide: Router, useValue: {} },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]

        });
        fixture = TestBed.createComponent(KfTarcMarketDataComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Check for KfTarcMarketDataComponent Creation', () => {
        expect(component).toBeTruthy();
    });
});
