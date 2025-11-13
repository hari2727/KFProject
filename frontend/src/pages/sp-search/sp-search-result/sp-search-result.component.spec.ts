import { KfSortDirection, SortableColumn } from '@kf-products-core/kfhub_thcl_lib/domain';
import { SpSearchResultComponent } from './sp-search-result.component';
import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CdkTableModule } from '@angular/cdk/table';
import { RouterTestingModule } from '@angular/router/testing';
import { KfIconModule } from '@kf-products-core/kfhub_lib/presentation';
import { TranslateMockModule } from '@kf-products-core/kfhub_lib/testing';
import { ThclDropdownModule, KfTableModule, KfSortModule } from '@kf-products-core/kfhub_thcl_lib/presentation';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { SortColumn, SpActionItemEnum } from '../sp-search.constant';

describe('SpSearchResultComponent', () => {
    let component: SpSearchResultComponent;
    let fixture: ComponentFixture<SpSearchResultComponent>;
    let emitSpy: jest.SpyInstance;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SpSearchResultComponent],
            imports: [
                TranslateMockModule,
                RouterTestingModule,
                CdkTableModule,
                KfIconModule,
                ThclDropdownModule,
                KfTableModule,
                KfSortModule,
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SpSearchResultComponent);
        component = fixture.componentInstance;
        component.onSortByColumn = new EventEmitter<{ id: string; direction: KfSortDirection }[]>(); // Create a new instance of EventEmitter
        emitSpy = jest.spyOn(component.onSortByColumn, 'emit'); // Create a spy on the emit method
    });

    it('should emit sorting with page index when sortByColumn is called', () => {
        const sorting = [
            { id: 'column1', direction: KfSortDirection.Asc },
            { id: 'column2', direction: KfSortDirection.Desc },
        ];
        component.pageIndex = 1;

        component.sortByColumn(sorting);

        expect(component.pageIndex).toBe(1);
        expect(emitSpy).toHaveBeenCalledWith([
            { id: 'column1', direction: KfSortDirection.Asc, pageIndex: 1 },
            { id: 'column2', direction: KfSortDirection.Desc, pageIndex: 1 },
        ]);
    });

    describe('generateTooltipText', () => {
        it('should return "pm.selectedLanguageDifferent" when actionType is SpActionItemEnum.CreateJD or SpActionItemEnum.CreateAssessmentPrj', () => {
            const actionType = SpActionItemEnum.CreateJD;
            const tooltip = component.generateTooltipText(actionType);
            expect(tooltip).toBe('pm.selectedLanguageDifferent');
        });

        it('should return "lib.errShortProfileCopyPM" when actionType is SpActionItemEnum.CopySP', () => {
            const actionType = SpActionItemEnum.CopySP;
            const tooltip = component.generateTooltipText(actionType);
            expect(tooltip).toBe('lib.errShortProfileCopyPM');
        });

        it('should return an empty string when actionType is not SpActionItemEnum.CreateJD, SpActionItemEnum.CreateAssessmentPrj, or SpActionItemEnum.CopySP', () => {
            const actionType = 'SomeOtherActionType';
            const tooltip = component.generateTooltipText(actionType);
            expect(tooltip).toBe('');
        });
    });

    describe('hover', () => {
        it('should set hideTooltip to true if the element height is greater than or equal to the scroll height', () => {
            const event = {
                srcElement: {
                    offsetHeight: 100,
                    scrollHeight: 80
                }
            };

            component.hover(event);

            expect(component.hideTooltip).toBe(true);
        });

        it('should set hideTooltip to false if the element height is less than the scroll height', () => {
            const event = {
                srcElement: {
                    offsetHeight: 80,
                    scrollHeight: 100
                }
            };

            component.hover(event);

            expect(component.hideTooltip).toBe(false);
        });

        it('should not set hideTooltip if event or srcElement is undefined', () => {
            const event = undefined;

            component.hover(event);

            expect(component.hideTooltip).toBe(true);
        });
    });

    describe('scrollDown', () => {
        it('should increment pageIndex and emit onScrollDown event if pageIndex is less than totalPages', () => {
            component.pageIndex = 1;
            component.totalPages = 5;
            const emitScrollSpy = jest.spyOn(component.onScrollDown, 'emit');

            component.scrollDown();

            expect(component.pageIndex).toBe(2);
            expect(emitScrollSpy).toHaveBeenCalledWith({ pageIndex: 2 });
        });

        it('should not increment pageIndex or emit onScrollDown event if pageIndex is equal to totalPages', () => {
            component.pageIndex = 5;
            component.totalPages = 5;
            const emitScrollSpy = jest.spyOn(component.onScrollDown, 'emit');

            component.scrollDown();

            expect(component.pageIndex).toBe(5);
            expect(emitScrollSpy).not.toHaveBeenCalled();
        });
    });

    describe('sorting', () => {
        it('should set _sorting property when sorting input is provided', () => {
            const sorting: SortableColumn<SortColumn>[] = [
                { id: 'column1', sortBy: KfSortDirection.Asc, title: 'Column 1', sortColumn: SortColumn.JobTitle },
                { id: 'column2', sortBy: KfSortDirection.Desc, title: 'Column 2', sortColumn: SortColumn.Levels },
            ];

            component.sorting = sorting;

            expect(component['_sorting']).toEqual([
                { id: 'column1', direction: KfSortDirection.Asc },
                { id: 'column2', direction: KfSortDirection.Desc },
            ]);
        });

        it('should set _sorting property to an empty array when sorting input is not provided', () => {
            component.sorting = undefined;

            expect(component['_sorting']).toEqual([]);
        });
    });

    describe('columns', () => {
        it('should set textColumns property when columns input is provided', () => {
            const columns = ['column1', 'column2', 'column3'];

            component.columns = columns;

            expect(component.textColumns).toEqual(['column2']);
        });

        it('should set textColumns property to an empty array when columns input is not provided', () => {
            component.columns = undefined;

            expect(component.textColumns).toEqual([]);
        });
    });

});
