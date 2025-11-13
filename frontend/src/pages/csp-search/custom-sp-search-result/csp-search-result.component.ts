import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dropdown } from '@kf-products-core/kfhub_thcl_lib/presentation';
import { SortableColumn, KfSortDirection } from '@kf-products-core/kfhub_thcl_lib/domain';

import { CspSearchRow, MenuCell, MenuItem, CspSearchColumns } from '../../csp-search/csp-search-model';
import { SortColumn, CspActionItemEnum, CspSearcColumnEnum } from '../../csp-search/csp-search-constants';

@Component({
    selector: 'kftarc-csp-search-result',
    templateUrl: './csp-search-result.component.html',
    styleUrls: ['./csp-search-result.component.scss']
})
export class CspSearchResultComponent {
    @Input() set columns(value: string[]) {
        this.textColumns = value ? value.concat().slice(1, value.length - 1) : [];
    }

    public _sorting: { id: string; direction: KfSortDirection }[] = [];

    @Input() public set sorting(value: SortableColumn<SortColumn>[]) {
        this._sorting = (value || []).map((s) => ({ id: s.id, direction: s.sortBy }));
    }

    @Input() exportToHCMessage: boolean;
    @Input() infiniteScrollDisabled = false;
    @Input() columnSource: CspSearchColumns;
    @Input() dataSource: CspSearchRow[];
    @Input() menuItems: MenuItem[] = [];
    @Input() totalRows: number;
    @Input() totalPages: number;
    @Input() pageIndex: number;

    @Output() onContextMenuClick = new EventEmitter<[MenuCell, Dropdown]>();
    @Output() onScrollDown = new EventEmitter<{ pageIndex: number }>();
    @Output() onSortByColumn = new EventEmitter<{ id: string; direction: KfSortDirection }[]>();
    @Output() public onSelect = new EventEmitter<any>();
    @Output() exportToHCMessageChange = new EventEmitter<boolean>();

    textColumns: string[];
    public hideTooltip = true;

    public spActionItemEnum = CspActionItemEnum;

    public spSearcColumnEnum = CspSearcColumnEnum;

    public isAllSelected: boolean;

    public sortByColumn(sorting: { id: string; direction: KfSortDirection }[]) {
        this.pageIndex = 1;
        const sortingWithPageIndex = sorting.map(sort => ({
            ...sort,
            pageIndex: this.pageIndex,
        }));

        this.onSortByColumn.emit(sortingWithPageIndex);
    }

    public scrollDown() {
        if (this.pageIndex < this.totalPages) {
            this.pageIndex += 1;
            this.onScrollDown.emit({ pageIndex: this.pageIndex });
        }
    }

    public hover(event) {
        if (event?.srcElement) {
            const element = event.srcElement;
            this.hideTooltip = element.offsetHeight >= element.scrollHeight;
        }
    }

    public generateTooltipText(actionType): string {
        let tooltip = '';
        if (actionType === CspActionItemEnum.CreateJD || actionType === CspActionItemEnum.CreateAssessmentPrj) {
            tooltip = 'pm.selectedLanguageDifferent';
        } else if (actionType === CspActionItemEnum.CopySP) {
            tooltip = 'lib.errShortProfileCopyPM';
        }
        return tooltip;
    }

    public selectRow(item): void {
        if (!item.jobCode || item.jobCode === '-') return;
        this.isAllSelected = this.dataSource
            .filter(d => d.jobCode && d.jobCode !== '-')
            .every(d => d.isSelected);

        this.onSelect.emit({ name: 'group', items: [item] });
    }

    public selectGroup(checked: boolean): void {
        this.isAllSelected = checked;

        this.dataSource.forEach(i => {
            if (i.jobCode && i.jobCode !== '-') {
                i.isSelected = checked;
            }
        });

        this.onSelect.emit({ name: 'group', items: this.dataSource });
    }

    public closeNotification(): void {
        this.exportToHCMessage = false;
        this.exportToHCMessageChange.emit(this.exportToHCMessage);
    }
}
