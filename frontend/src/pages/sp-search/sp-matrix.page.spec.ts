import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpMatrixPage } from './sp-matrix.page';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { KfGrowlService, KfAuthService, KfTranslationService, KfTitlecasePipe, KfStorageService } from '@kf-products-core/kfhub_lib';
import { KfTarcSpMatrixService } from '../../app/modules/services/kftarc-sp-matrix.service';
import { KfThclSuccessprofileService, KfThclSpCompareBucketService, KfISpRolesLoaderService, KfThclTalentArchitectConstantsService } from '@kf-products-core/kfhub_thcl_lib';
import { SpSearchFilterEnum } from './sp-search.constant';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { State } from './sp-search.state';
import { actionFilterRemoveAll } from './sp-search.actions';
import { HttpService } from '../../app/services/http.service';


describe('SpMatrixPage', () => {
    let component: SpMatrixPage;
    let matrixService: KfTarcSpMatrixService;
    let activatedRoute: ActivatedRoute;
    let authService: KfAuthService;
    let bucketService: KfThclSpCompareBucketService;
    let growlService: KfGrowlService;
    let router: Router;
    let store: Store<State>;
    let successProfileService: KfThclSuccessprofileService;
    let translationService: KfTranslationService;
    let roleSpLoader: KfISpRolesLoaderService;
    let httpService: HttpService;
    let storageService: KfStorageService;

    beforeEach(() => {
        matrixService = jest.fn() as any;
        activatedRoute = jest.fn() as any;
        authService = jest.fn() as any;
        bucketService = jest.fn() as any;
        growlService = jest.fn() as any;
        router = {
            navigate: jest.fn()
        } as any;
        store = jest.fn() as any;
        successProfileService = jest.fn() as any;
        translationService = jest.fn() as any;
        roleSpLoader = jest.fn() as any;


        component = new SpMatrixPage(
            matrixService,
            activatedRoute,
            authService,
            bucketService,
            growlService,
            router,
            store,
            successProfileService,
            translationService,
            roleSpLoader,
            httpService,
            storageService,
        );
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have first selectedFilter of type ProfileCollections', () => {
        const filters = [{ type: SpSearchFilterEnum.ProfileCollections, label: 'some label', value: 'some value' }];
        component.selectedFilters = filters;
        expect(component.selectedFilters[0].type).toEqual(SpSearchFilterEnum.ProfileCollections);
    });

    it('should (onFilterChange) set selectedFilters to meta.filters when meta.filters is not empty', () => {
        const meta = { filters: [{ type: SpSearchFilterEnum.ProfileCollections, label: 'some label', value: 'some value' }] };
        component.onFilterChange(meta);
        expect(component.selectedFilters).toEqual(meta.filters);
    });
    it('should set spSelected to false and warningNotificationMessage to empty string when data is null', () => {
        component.popupDataChanges(null);
        expect(component.spSelected).toBe(false);
        expect(component.warningNotificationMessage).toBe('');
    });

    it('should set selectedView to "list" and navigate to "tarc/sp/search" when name is "list"', () => {
        const navigateSpy = jest.spyOn(router, 'navigate');
        component.viewChange('list');
        expect(component.selectedView).toBe('list');
        expect(navigateSpy).toHaveBeenCalledWith(['tarc/sp/search']);
    });

    it('should set selectedView to "cards" and navigate to "tarc/sp/matrix" when name is "cards"', () => {
        const navigateSpy = jest.spyOn(router, 'navigate');
        component.viewChange('cards');
        expect(component.selectedView).toBe('cards');
        expect(navigateSpy).toHaveBeenCalledWith(['tarc/sp/matrix']);
    });

    it('should not change selectedView or navigate when name is not "list" or "cards"', () => {
        const navigateSpy = jest.spyOn(router, 'navigate');
        const initialSelectedView = component.selectedView;
        component.viewChange('other');
        expect(component.selectedView).toBe(initialSelectedView);
        expect(navigateSpy).not.toHaveBeenCalled();
    });

    it('should navigate to "tarc/sp/compare" when gotoCompare is called', () => {
        const navigateSpy = jest.spyOn(router, 'navigate');
        component.gotoCompare();
        expect(navigateSpy).toHaveBeenCalledWith(['tarc/sp/compare']);
    });

    it('should set isBucketExpanded to the event value when expandChanged is called', () => {
        component.expandChanged(true);
        expect(component.isBucketExpanded).toBe(true);
        component.expandChanged(false);
        expect(component.isBucketExpanded).toBe(false);
    });

    it('should set roleSpSelectorVisible to false when onRoleSpSelectorClose is called', () => {
        component.onRoleSpSelectorClose();
        expect(component.roleSpSelectorVisible).toBe(false);
    });

    it('should set selectedRole and roleSpSelectorVisible when openRoleSpSelector is called', () => {
        const role = { id: 'testId', name: 'testName' };
        component.openRoleSpSelector(role);
        expect(component.selectedRole).toEqual(role);
        expect(component.roleSpSelectorVisible).toBe(true);
    });

    it('should set execGrading properties and showExecGrading when openExecGrading is called', () => {
        const data = { id: 'testId', jobId: 'testJobId', name: 'testName', standardHayGrade: 'testGrade' };
        component.openExecGrading(data);
        expect(component.execGradingRoleId).toBe(data.id);
        expect(component.execGradingJobId).toBe(data.jobId);
        expect(component.execGradingTitle).toBe(data.name);
        expect(component.execStandardHayGrade).toBe(data.standardHayGrade);
        expect(component.showExecGrading).toBe(true);
    });

    it('should return correct icon based on data', () => {
        const data1 = { parentId: 'GNX' };
        const data2 = { subType: 'jobProfile' };
        const data3 = { subType: 'other' };
        expect(component.getIcon(data1)).toBe('profile-level');
        expect(component.getIcon(data2)).toBe('profile-task');
        expect(component.getIcon(data3)).toBe('profile-function');
    });

    it('should return true when hasCustomGrades is true and value is not null and minCustomValue and maxCustomValue are null', () => {
        const matrixEntry = { value: 'some value', minCustomValue: null, maxCustomValue: null };
        component.hasCustomGrades = true;
        expect(component.shouldShowKfGradeIcon(matrixEntry)).toBe(true);
    });

    it('should return false when hasCustomGrades is false', () => {
        const matrixEntry = { value: 'some value', minCustomValue: null, maxCustomValue: null };
        component.hasCustomGrades = false;
        expect(component.shouldShowKfGradeIcon(matrixEntry)).toBe(false);
    });

    it('should unsubscribe all subscriptions, clear interactive messages and dispatch actionFilterRemoveAll', () => {
        const subscriptions = [{ unsubscribe: jest.fn() }, { unsubscribe: jest.fn() }];
        component['subscriptions'] = subscriptions;
        growlService.clearInteractiveMessages = jest.fn();
        store.dispatch = jest.fn();
        component.ngOnDestroy();
        subscriptions.forEach(sub => {
            expect(sub.unsubscribe).toHaveBeenCalled();
        });
        expect(growlService.clearInteractiveMessages).toHaveBeenCalled();
        expect(store.dispatch).toHaveBeenCalledWith(actionFilterRemoveAll());
    });

});
