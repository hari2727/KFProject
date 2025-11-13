import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dropdown } from '@kf-products-core/kfhub_thcl_lib/presentation';
import { SortableColumn, KfSortDirection } from '@kf-products-core/kfhub_thcl_lib/domain';

import { MenuCell, MenuItem, SpSearchColumns, SpSearchRow } from '../sp-search.model';
import { SortColumn, SpActionItemEnum, SpSearcColumnEnum } from '../sp-search.constant';

@Component({
    selector: 'kftarc-sp-search-result',
    templateUrl: './sp-search-result.component.html',
    styleUrls: ['./sp-search-result.component.scss']
})
export class SpSearchResultComponent {
    @Input() set columns(value: string[]) {
        this.textColumns = value ? value.concat().slice(1, value.length - 1) : [];
    }

    public _sorting: { id: string; direction: KfSortDirection }[] = [];

    @Input() public set sorting(value: SortableColumn<SortColumn>[]) {
        this._sorting = (value || []).map((s) => ({ id: s.id, direction: s.sortBy }));
    }

    @Input() infiniteScrollDisabled = false;
    @Input() columnSource: SpSearchColumns;
    @Input() dataSource: SpSearchRow[];
    @Input() menuItems: MenuItem[] = [];
    @Input() totalRows: number;
    @Input() totalPages: number;
    @Input() pageIndex: number;

    @Output() onContextMenuClick = new EventEmitter<[MenuCell, Dropdown]>();
    @Output() onScrollDown = new EventEmitter<{ pageIndex: number }>();
    @Output() onSortByColumn = new EventEmitter<{ id: string; direction: KfSortDirection }[]>();
    textColumns: string[];
    public hideTooltip = true;

    public spActionItemEnum = SpActionItemEnum;

    public spSearcColumnEnum = SpSearcColumnEnum;

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
        if (actionType === SpActionItemEnum.CreateJD || actionType === SpActionItemEnum.CreateAssessmentPrj) {
            tooltip = 'pm.selectedLanguageDifferent';
        } else if (actionType === SpActionItemEnum.CopySP) {
            tooltip = 'lib.errShortProfileCopyPM';
        }
        return tooltip;
    }
}
