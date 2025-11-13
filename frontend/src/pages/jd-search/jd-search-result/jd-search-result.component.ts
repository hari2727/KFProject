import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Dropdown } from '@kf-products-core/kfhub_thcl_lib/presentation';
import { KfSortDirection, SortableColumn } from '@kf-products-core/kfhub_thcl_lib/domain';

import { JdMenuCell, MenuItem, JdSearchColumns, JdSearchRow } from '../jd-search.model';
import { SortColumn } from '../jd-search.constant';

@Component({
    selector: 'kftarc-jd-search-result',
    templateUrl: './jd-search-result.component.html',
    styleUrls: ['./jd-search-result.component.scss']
})
export class JdSearchResultComponent implements OnInit {
    @Input() set columns(value: string[]) {
        this.textColumns = value.concat().slice(1, value.length - 1);
    }

    public _sorting: { id: string; direction: KfSortDirection }[] = [];

    @Input() public set sorting(value: SortableColumn<SortColumn>[]) {
        this._sorting = (value || []).map((s) => ({ id: s.id, direction: s.sortBy }));
    }
    @Input() infiniteScrollDisabled = false;
    @Input() columnSource: JdSearchColumns;
    @Input() dataSource: JdSearchRow[];
    @Input() menuItems: MenuItem[] = [];
    @Input() totalRows: number;
    @Input() totalPages: number;
    @Input() pageIndex: number;

    @Output() onContextMenuClick = new EventEmitter<[JdMenuCell, Dropdown]>();
    @Output() onScrollDown = new EventEmitter<{ pageIndex: number }>();
    @Output() onSortByColumn = new EventEmitter<{ id: string; direction: KfSortDirection }[]>();
    textColumns: string[];
    public hideTooltip = true;
    constructor() { }

    sortByColumn(sorting: { id: string; direction: KfSortDirection }[]) {
        this.pageIndex = 1;
        this.onSortByColumn.emit(sorting);
    }

    scrollDown(event: any) {
        if (this.pageIndex < this.totalPages) {
            this.pageIndex += 1;
            this.onScrollDown.emit({ pageIndex: this.pageIndex });
        }

    }

    ngOnInit(): void {
    }

    hover(event) {
        if (event?.srcElement) {
            const element = event.srcElement;
            this.hideTooltip = element.offsetHeight >= element.scrollHeight;
        }
    }

}
